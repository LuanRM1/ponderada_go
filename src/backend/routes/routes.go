package routes

import (
	"github.com/gin-gonic/gin"

	"backend/controllers"
	"backend/middleware"
)

// SetupRoutes initializes all routes for the application
func SetupRoutes(r *gin.Engine) {
	// Initialize controllers
	userController := controllers.NewUserController()
	productController := controllers.NewProductController()

	// Auth routes (no authentication required)
	r.POST("/auth/register", userController.Register)
	r.POST("/auth/login", userController.Login)

	// User routes (authentication required)
	userRoutes := r.Group("/users")
	userRoutes.Use(middleware.AuthMiddleware())
	{
		userRoutes.GET("/me", userController.GetProfile)
		userRoutes.PUT("/me", userController.UpdateProfile)
		userRoutes.POST("/me/image", userController.UploadProfileImage)
	}

	// Admin user routes (authentication required)
	adminRoutes := r.Group("/admin")
	adminRoutes.Use(middleware.AuthMiddleware())
	{
		adminRoutes.GET("/users", userController.GetAllUsers)
		adminRoutes.GET("/users/:id", userController.GetUserByID)
		adminRoutes.DELETE("/users/:id", userController.DeleteUser)
	}

	// Product routes - public (no authentication required)
	r.GET("/products", productController.GetAllProducts)
	r.GET("/products/:id", productController.GetProductByID)

	// Product routes - protected (authentication required)
	protectedProducts := r.Group("/products")
	protectedProducts.Use(middleware.AuthMiddleware())
	{
		protectedProducts.POST("", productController.CreateProduct)
		protectedProducts.PUT("/:id", productController.UpdateProduct)
		protectedProducts.DELETE("/:id", productController.DeleteProduct)
		protectedProducts.POST("/:id/image", productController.UploadProductImage)
	}
}

// InitRoutes registers all routes with the gin engine
func InitRoutes(r *gin.Engine) {
	SetupRoutes(r)
} 