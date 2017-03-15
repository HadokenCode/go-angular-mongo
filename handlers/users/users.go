package users

import (
	"fmt"
	"net/http"
	"time"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
	"github.com/gin-mongo-api/models"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// Create an user
func Create(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	user := models.User{}
	err := c.Bind(&user)
	if err != nil {
		c.Error(err)
		return
	}

	password := user.Password
	hash, _ := HashPassword(password) // ignore error for the sake of simplicity

	//fmt.Println("Password:", password)
	//fmt.Println("Hash:    ", hash)

	//match := CheckPasswordHash(password, hash)
	//fmt.Println("Match:   ", match)

	user.Salt = hash
	user.Password = hash

	user.CreatedOn = time.Now().UnixNano() / int64(time.Millisecond)
	user.UpdatedOn = time.Now().UnixNano() / int64(time.Millisecond)

	fmt.Println(user)

	// Check if the username is already existing
	query := bson.M{
		"username": user.Username,
	}
	//existing := true
	err = db.C(models.CollectionUser).Find(query).Sort("-_id").One(&user)
	if err != nil {
		fmt.Println("existing", err)
		fmt.Println("existing", user)
		//c.Error(err)
		//return
		//existing = false
	}

	//if existing == true {
	err = db.C(models.CollectionUser).Insert(user)
	if err != nil {
		c.Error(err)
		return
	}
	//}

	/*query = bson.M{
		"username": user.Username,
		"password": hash,
	}
	err = db.C(models.CollectionUser).Find(query).Sort("-_id").One(&user)
	if err != nil {
		c.Error(err)
		return
	}

	return */

	//c.JSON(http.StatusOK, user)

}

// List all users
func List(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	users := []models.User{}
	err := db.C(models.CollectionUser).Find(nil).Sort("-_id").All(&users)
	if err != nil {
		c.Error(err)
		return
	}

	c.JSON(http.StatusOK, users)
}

// Update an user
func Update(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)

	user := models.User{}
	err := c.Bind(&user)
	if err != nil {
		c.Error(err)
		return
	}

	query := bson.M{"_id": user.Id}
	doc := bson.M{
		"created_on": user.CreatedOn,
		"updated_on": time.Now().UnixNano() / int64(time.Millisecond),
	}
	err = db.C(models.CollectionUser).Update(query, doc)
	if err != nil {
		c.Error(err)
		return
	}
}

// Delete an user
func Delete(c *gin.Context) {
	db := c.MustGet("db").(*mgo.Database)
	user := models.User{}
	err := c.Bind(&user)
	if err != nil {
		c.Error(err)
		return
	}
	query := bson.M{"_id": user.Id}
	err = db.C(models.CollectionUser).Remove(query)
	if err != nil {
		c.Error(err)
		return
	}
}
