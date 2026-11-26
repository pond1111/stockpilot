package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// แก้ไขตรงนี้ในไฟล์ main.go หลังบ้านคราฟ
type Product struct {
	ID       string  `json:"id" json:"ID"`
	Name     string  `json:"name" json:"Name"`
	Price    float64 `json:"price" json:"Price"`
	Stock    int     `json:"stock" json:"Stock"`
	Category string  `json:"category" json:"Category"`
}

func main() {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/products", func(c *gin.Context) {
		mockProducts := []Product{
			{ID: "1", Name: "มาม่าต้มยำกุ้ง", Price: 7.0, Stock: 50, Category: "Food"},
			{ID: "2", Name: "ปลากระป๋อง", Price: 20.0, Stock: 30, Category: "Food"},
		}
		c.JSON(http.StatusOK, mockProducts)
	})

	r.Run(":8080")
}
