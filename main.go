// Package main is the CLI.
// You can use the CLI via Terminal.
package main

import (
	"net/http"
	"os"

	"github.com/GoGAM/db"
	"github.com/GoGAM/handlers/articles"
	"github.com/GoGAM/middlewares"
	"github.com/gin-gonic/gin"
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

	// Articles
	router.GET("/api/articles", articles.List)
	router.POST("/api/new/articles/:payload", articles.Create)
	router.POST("/api/update/articles/:payload", articles.Update)
	router.POST("/api/delete/articles/:payload", articles.Delete)

	// Start listening
	port := Port
	if len(os.Getenv("PORT")) > 0 {
		port = os.Getenv("PORT")
	}
	router.Run(":" + port)
}
