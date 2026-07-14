package routes

import (
	"b/handlers/leetcode"
	"net/http"
)

func RegisterRoutes() {
	http.HandleFunc("/", leetcode.GetProfile)
}