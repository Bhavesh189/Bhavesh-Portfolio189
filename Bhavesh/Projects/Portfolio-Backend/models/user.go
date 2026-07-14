package models

type User struct {
	TotalSolved       int    `json:"totalSolved"`
	EasySolved        int    `json:"easySolved"`
	MediumSolved      int    `json:"mediumSolved"`
	HardSolved        int    `json:"hardSolved"`
	Ranking           int    `json:"ranking"`
	ContributionPoint int    `json:"contributionPoint"`
	Reputation        int    `json:"reputation"`
}