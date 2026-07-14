package main

import (
	"b/routes"
	"fmt"
	"net/http"
)

func main() {
	fmt.Println("Main Function Run")

	routes.RegisterRoutes()


	http.ListenAndServe(":8045", nil)
}