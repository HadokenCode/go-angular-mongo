// Package main is the CLI.
// You can use the CLI via Terminal.
package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/GoGAM/db"
	"github.com/GoGAM/handlers/articles"
	//"github.com/GoGAM/handlers/register"
	"github.com/GoGAM/middlewares"
	//"github.com/fvbock/endless"
	"github.com/gin-gonic/gin"
	"gopkg.in/appleboy/gin-jwt.v2"
)

const (
	// Port at which the server starts listening
	Port = "7324"
)

func init() {
	db.Connect()
}

func helloHandler(c *gin.Context) {
	c.JSON(200, gin.H{
		"text": "Hello World.",
	})
}

func main() {

	// Configure
	router := gin.New()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.RedirectTrailingSlash = true
	router.RedirectFixedPath = false

	// Middlewares
	router.Use(middlewares.Connect)
	router.Use(middlewares.ErrorHandler)

	// Statics
	router.Static("/public", "./public")

	// Routes

	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/public")
	})

	http.Handle("/public", router)

	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "admin",
		Key:        []byte("admin"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
			if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
				//c.Redirect(http.StatusMovedPermanently, "/public/")
				return userId, true
			}

			return userId, false
		},
		Authorizator: func(userId string, c *gin.Context) bool {
			if userId == "admin" || userId == "test" {
				return true
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":         code,
				"errorMessage": message,
				"success":      false,
				"message":      "You are not allowed to access this, please contact administrator.",
			})
		},
		// TokenLookup is a string in the form of "<source>:<name>" that is used
		// to extract token from the request.
		// Optional. Default value "header:Authorization".
		// Possible values:
		// - "header:<name>"
		// - "query:<name>"
		// - "cookie:<name>"
		TokenLookup: "header:Authorization",
		// TokenLookup: "query:token",
		// TokenLookup: "cookie:token",
	}

	//Register & Login
	//router.GET("/api/registernew/:payload", register.Init)

	router.POST("/login", authMiddleware.LoginHandler)

	auth := router.Group("/api")
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		fmt.Println(authMiddleware.Realm)
		fmt.Println(authMiddleware.Key)
		auth.GET("/hello", helloHandler)
		auth.GET("/refresh_token", authMiddleware.RefreshHandler)

		// Articles
		auth.GET("/articles", articles.List)
		auth.POST("/new/articles/:payload", articles.Create)
		auth.POST("/update/articles/:payload", articles.Update)
		auth.POST("/delete/articles/:payload", articles.Delete)
	}

	// Start listening
	port := Port
	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}
	router.Run(":" + port)
	//endless.ListenAndServe(":"+port, router)
}
