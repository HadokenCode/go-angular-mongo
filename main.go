package main

import (
	"flag"
	"fmt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"log"
	"net/http"
	"time"
)

type person struct {
	ID        bson.ObjectId `bson:"_id,omitempty"`
	Name      string
	Phone     string
	Timestamp time.Time
}

var (
	isDrop = false
)

func main() {

	//mgo connection
	session, err := mgo.Dial("127.0.0.1")
	if err != nil {
		panic(err)
	}

	defer session.Close()

	session.SetMode(mgo.Monotonic, true)

	// Drop Database
	if isDrop {
		err = session.DB("test").DropDatabase()
		if err != nil {
			panic(err)
		}
	}

	// Collection People
	c := session.DB("test").C("people")

	// Index
	index := mgo.Index{
		Key:        []string{"name", "phone"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	err = c.EnsureIndex(index)
	if err != nil {
		panic(err)
	}

	// Insert Datas
	// err = c.Insert(&person{Name: "Ale", Phone: "+55 53 1234 4321", Timestamp: time.Now()},
	// 	&person{Name: "Cla", Phone: "+66 33 1234 5678", Timestamp: time.Now()})

	// if err != nil {
	// 	panic(err)
	// }

	// Query One
	result := person{}
	err = c.Find(bson.M{"name": "Ale"}).Select(bson.M{"phone": 0}).One(&result)
	if err != nil {
		panic(err)
	}
	fmt.Println("Phone", result)

	// Query All
	var results []person
	err = c.Find(bson.M{"name": "Ale"}).Sort("-timestamp").All(&results)

	if err != nil {
		panic(err)
	}
	fmt.Println("Results All: ", results)

	fmt.Println("End")
	// Update
	// colQuerier := bson.M{"name": "Ale"}
	// change := bson.M{"$set": bson.M{"phone": "+86 99 8888 7777", "timestamp": time.Now()}}
	// err = c.Update(colQuerier, change)
	// if err != nil {
	// 	panic(err)
	// }

	// command line flags
	port := flag.Int("port", 8082, "port to serve on")
	dir := flag.String("directory", "public/", "directory of web files")
	flag.Parse()

	//handle all requests by serving a file of the same name
	fs := http.Dir(*dir)
	handler := http.FileServer(fs)
	http.Handle("/", handler)
	log.Printf("Running on port %d\n", *port)

	addr := fmt.Sprintf("127.0.0.1:%d", *port)
	handler1 := http.ListenAndServe(addr, nil)
	fmt.Println(handler1.Error())
}
