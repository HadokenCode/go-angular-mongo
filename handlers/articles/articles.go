package articles

import (
	"fmt"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/GoGAM/models"
	"github.com/gin-gonic/gin"
)

// Create an article
func Create(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	article := models.Article{}
	err := c.Bind(&article)
	if err != nil {
		c.Error(err)
		return
	}

	article.CreatedOn = time.Now().UnixNano() / int64(time.Millisecond)
	article.UpdatedOn = time.Now().UnixNano() / int64(time.Millisecond)

	err = db.C(models.CollectionArticle).Insert(article)
	if err != nil {
		c.Error(err)
	}
}

// List all articles
func List(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	articles := []models.Article{}
	err := db.C(models.CollectionArticle).Find(nil).Sort("-_id").All(&articles)
	if err != nil {
		c.Error(err)
	}

	c.JSON(http.StatusOK, articles)
}

// Update an article
func Update(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	article := models.Article{}
	err := c.Bind(&article)
	if err != nil {
		c.Error(err)
		return
	}

	query := bson.M{"_id": article.Id}
	doc := bson.M{
		"title":      article.Title,
		"body":       article.Body,
		"created_on": article.CreatedOn,
		"updated_on": time.Now().UnixNano() / int64(time.Millisecond),
	}
	err = db.C(models.CollectionArticle).Update(query, doc)
	if err != nil {
		c.Error(err)
	}
}

// Delete an article
func Delete(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	article := models.Article{}
	err := c.Bind(&article)
	if err != nil {
		c.Error(err)
		return
	}
	query := bson.M{"_id": article.Id}
	err = db.C(models.CollectionArticle).Remove(query)
	if err != nil {
		c.Error(err)
	}
}
