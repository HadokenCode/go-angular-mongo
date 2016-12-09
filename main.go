package main

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/gorilla/reverse"
	"net/http"
)

func main() {
	const PORT = ":7324"
	r := mux.NewRouter()

	func1 := func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("hellow there world pow"))
	}

	func2 := func(w http.ResponseWriter, r *http.Request) {
		payload := mux.Vars(r)
		w.Write([]byte(payload["id"]))
	}

	//r.PathPrefix("/api").HandlerFunc(func1)
	r.HandleFunc("/", func1)

	sr := r.PathPrefix("/").Subrouter()
	sr.HandleFunc("/api/{id:[0-9]+}", func2)
	//r.HandleFunc("/user/{id:[0-9]+}", func2)
	http.Handle("/", r)
	go http.ListenAndServe(PORT, nil)
	fmt.Println("listening to port" + PORT + "....")
	fmt.Scanln()
}
