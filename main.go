package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-angular-mongo/db"
	"github.com/go-angular-mongo/handlers/articles"
	//"github.com/go-angular-mongo/handlers/login"
	"github.com/go-angular-mongo/middlewares"
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

func main() {

	// Configure
	router := gin.New()

	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	router.RedirectTrailingSlash = false
	router.RedirectFixedPath = false

	// Middlewares
	router.Use(middlewares.Connect)
	router.Use(middlewares.ErrorHandler)

	// Statics
	router.Static("/public/", "./public")

	// Routes

	// router.GET("/", func(c *gin.Context) {
	// 	c.Redirect(http.StatusMovedPermanently, "/public/")
	// })

	http.Handle("/api", router)

	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "admin",
		Key:        []byte("admin"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour,
		Authenticator: func(userId string, password string, c *gin.Context) (string, bool) {
			if (userId == "admin" && password == "admin") || (userId == "test" && password == "test") {
				//c.Redirect(http.StatusMovedPermanently, "/public/")
				fmt.Println(c)
				return userId, true
			}

			return userId, false
		},
		Authorizator: func(userId string, c *gin.Context) bool {
			if userId == "admin" {
				//fmt.Println(c)
				//c.Redirect(http.StatusMovedPermanently, "/public/main/")
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
