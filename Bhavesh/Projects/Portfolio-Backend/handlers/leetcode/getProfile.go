package leetcode

import (
	"b/models"
	"encoding/json"
	"net/http"
)

func GetProfile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	res, err := http.Get("https://alfa-leetcode-api.onrender.com/bhavesh1899287/profile")

	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusBadGateway)
		return
	}

	defer res.Body.Close()

	var u models.User

	err = json.NewDecoder(res.Body).Decode(&u)

	if err != nil {
		http.Error(w, "Decoding Error", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(u)
}