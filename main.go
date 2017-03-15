package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-mongo-api/db"
	"github.com/gin-mongo-api/handlers/articles"
	"github.com/gin-mongo-api/handlers/users"
	"github.com/gin-mongo-api/middlewares"
	"github.com/gin-mongo-api/models"
	"github.com/itsjamie/gin-cors"
	//"github.com/fvbock/endless" //this is for production
	//"golang.org/x/crypto/bcrypt"
	"gopkg.in/appleboy/gin-jwt.v2"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
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
	router := gin.Default()
	//gin.SetMode(gin.ReleaseMode)

	router.Use(cors.Middleware(cors.Config{
		Origins:         "*",
		Methods:         "GET, PUT, POST, DELETE",
		RequestHeaders:  "Origin, Authorization, Content-Type",
		ExposedHeaders:  "",
		MaxAge:          12 * time.Hour,
		Credentials:     true,
		ValidateHeaders: true,
	}))

	router.RedirectTrailingSlash = false
	router.RedirectFixedPath = false

	authMiddleware := &jwt.GinJWTMiddleware{
		Realm:      "admin",
		Key:        []byte("admin"),
		Timeout:    time.Hour,
		MaxRefresh: time.Hour * 24,
		Authenticator: func(username string, password string, c *gin.Context) (string, bool) {

			db := c.MustGet("db").(*mgo.Database)

			query := bson.M{
				"username": username,
				//"password": password,
			}
			user := models.User{}
			//fmt.Println(username, password)

			err := db.C(models.CollectionUser).Find(query).Sort("-_id").One(&user)
			//fmt.Println(user)
			//err = bcrypt.CompareHashAndPassword([]byte(user.Salt), bpassword)
			//fmt.Println(err)
			bpassword := password
			//hash, _ := users.HashPassword(bpassword) // ignore error for the sake of simplicity

			//fmt.Println("Password:", bpassword)
			//fmt.Println("Hash1:    ", hash)
			//fmt.Println("Hash2:    ", user.Salt)

			match := users.CheckPasswordHash(bpassword, user.Salt)
			fmt.Println("Match:   ", match)

			/*if match != true {
				c.JSON(200, "Invalid Password")
				return username, false
			}*/

			if err != nil || match != true {
				//fmt.Println(err)
				c.Error(err)
				return username, false
			}

			return username, true
		},
		Authorizator: func(username string, c *gin.Context) bool {
			return true
		},
		Unauthorized: func(c *gin.Context, code int, message string) {
			c.JSON(code, gin.H{
				"code":         code,
				"errorMessage": message,
				"success":      false,
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

	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middlewares.Connect)
	router.Use(middlewares.ErrorHandler)

	//Routes
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
		// Users
		auth.GET("/users", users.List)
		auth.POST("/new/users/:payload", users.Create)
		auth.POST("/update/users/:payload", users.Update)
		auth.POST("/delete/users/:payload", users.Delete)
	}

	// If the routes is not existing
	router.NoRoute(func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "PAGE_NOT_FOUND", "message": "Page not found"})
	})

	http.Handle("/api", router)

	// Start listening
	port := Port
	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}
	router.Run(":" + port)
	//endless.ListenAndServe(":"+port, router)
}
