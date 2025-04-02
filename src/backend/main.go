package main

import (
	"log"
	"os"
	"path/filepath"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"backend/config"
	"backend/models"
	"backend/routes"
)

func main() {
	// Set Gin mode
	gin.SetMode(os.Getenv("GIN_MODE"))

	// Initialize router
	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Create uploads directory if it doesn't exist
	uploadsDir := "./uploads"
	if err := os.MkdirAll(uploadsDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create uploads directory: %v", err)
	}

	// Create subdirectories for user and product images
	userImagesDir := filepath.Join(uploadsDir, "users")
	productImagesDir := filepath.Join(uploadsDir, "products")
	
	if err := os.MkdirAll(userImagesDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create user images directory: %v", err)
	}
	
	if err := os.MkdirAll(productImagesDir, os.ModePerm); err != nil {
		log.Fatalf("Failed to create product images directory: %v", err)
	}

	// Serve static files
	r.Static("/uploads", "./uploads")

	// Add a test route
	r.GET("/test", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "This is a test route",
		})
	})

	// Initialize database connection
	initDB()

	// Initialize routes
	routes.InitRoutes(r)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	
	log.Printf("Server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

// Initialize database connection
func initDB() {
	// Connect to database
	config.ConnectDB()
	
	// Auto-migrate models
	db := config.GetDB()
	db.AutoMigrate(&models.User{}, &models.Product{})
	
	log.Println("Database models migrated successfully")
} 