package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func main() {
	r := mux.NewRouter()

	// func1 := func(w http.ResponseWriter, r *http.Request) {
	// 	w.Write([]byte("hellow there 1"))
	// }

	func2 := func(w http.ResponseWriter, r *http.Request) {
		payload := mux.Vars(r)
		w.Write([]byte(payload["id"]))
	}

	//r.PathPrefix("/api").HandlerFunc(func1)
	r.HandleFunc("/user/{id}", func2)
	http.Handle("/", r)
	go http.ListenAndServe(":7323", nil)
	fmt.Println("listening to port:7323....")
	fmt.Scanln()
}
