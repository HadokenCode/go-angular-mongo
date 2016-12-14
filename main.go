// Package main is the CLI.
// You can use the CLI via Terminal.
package main

import (
	"net/http"
	"os"
	"time"

	"github.com/GoGAM/db"
	"github.com/GoGAM/handlers/articles"
	//"github.com/GoGAM/handlers/register"
	"github.com/GoGAM/middlewares"
	"github.com/fvbock/endless"
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

	// c.JSON(http.StatusOK, {
	// 	"text": "Hello World.",
	// })
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

	//Register & Login
	//router.GET("/api/registernew/:payload", register.Init)

	// Articles
	router.GET("/api/articles", articles.List)
	router.POST("/api/new/articles/:payload", articles.Create)
	router.POST("/api/update/articles/:payload", articles.Update)
	router.POST("/api/delete/articles/:payload", articles.Delete)

	// the jwt middleware
	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "admin",
		Key:        []byte("admin"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
			if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
				return userId, true
			}

			return userId, false
		},
		Authorizator: func(userId string, c *gin.Context) bool {
			if userId == "admin" {
				return truebranch
			}

			return false
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":    code,
				"message": message,
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

	router.POST("/login", authMiddleware.LoginHandler)

	auth := router.Group("/auth")
	auth.Use(authMiddleware.MiddlewareFunc())
	{
		auth.GET("/hello", helloHandler)
		auth.GET("/refresh_token", authMiddleware.RefreshHandler)
	}

	// Start listening
	port := Port
	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}
	//router.Run(":" + port)
	endless.ListenAndServe(":"+port, router)
}
