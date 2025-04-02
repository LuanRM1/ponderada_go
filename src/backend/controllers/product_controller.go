package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"backend/config"
	"backend/models"
	"backend/utils"
)

// ProductController handles product-related operations
type ProductController struct {
	DB *gorm.DB
}

// NewProductController creates a new ProductController
func NewProductController() *ProductController {
	return &ProductController{
		DB: config.GetDB(),
	}
}

// CreateProduct creates a new product
func (pc *ProductController) CreateProduct(c *gin.Context) {
	// Parse product data from form
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create product
	if err := pc.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	// Return product response
	c.JSON(http.StatusCreated, gin.H{"product": product.ToResponse()})
}

// GetAllProducts gets all products
func (pc *ProductController) GetAllProducts(c *gin.Context) {
	var products []models.Product
	if err := pc.DB.Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get products"})
		return
	}

	// Convert products to responses
	var productResponses []models.ProductResponse
	for _, product := range products {
		productResponses = append(productResponses, product.ToResponse())
	}

	c.JSON(http.StatusOK, gin.H{"products": productResponses})
}

// GetProductByID gets a product by ID
func (pc *ProductController) GetProductByID(c *gin.Context) {
	// Get product ID from URL parameter
	productID := c.Param("id")
	id, err := strconv.ParseUint(productID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Find product by ID
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Return product response
	c.JSON(http.StatusOK, gin.H{"product": product.ToResponse()})
}

// UpdateProduct updates a product
func (pc *ProductController) UpdateProduct(c *gin.Context) {
	// Get product ID from URL parameter
	productID := c.Param("id")
	id, err := strconv.ParseUint(productID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Find product by ID
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Parse update data
	var updateData struct {
		Name        string  `json:"name"`
		Description string  `json:"description"`
		Price       float64 `json:"price"`
		Quantity    int     `json:"quantity"`
	}

	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields if provided
	if updateData.Name != "" {
		product.Name = updateData.Name
	}
	if updateData.Description != "" {
		product.Description = updateData.Description
	}
	if updateData.Price != 0 {
		product.Price = updateData.Price
	}
	if updateData.Quantity != 0 {
		product.Quantity = updateData.Quantity
	}

	// Save product
	if err := pc.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	// Return product response
	c.JSON(http.StatusOK, gin.H{"product": product.ToResponse()})
}

// DeleteProduct deletes a product
func (pc *ProductController) DeleteProduct(c *gin.Context) {
	// Get product ID from URL parameter
	productID := c.Param("id")
	id, err := strconv.ParseUint(productID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Find product by ID
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Delete product's image if it exists
	if product.ImagePath != "" {
		utils.DeleteFile(product.ImagePath)
	}

	// Delete product
	if err := pc.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// UploadProductImage uploads an image for a product
func (pc *ProductController) UploadProductImage(c *gin.Context) {
	// Get product ID from URL parameter
	productID := c.Param("id")
	id, err := strconv.ParseUint(productID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	// Find product by ID
	var product models.Product
	if err := pc.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Get file from request
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Validate file type
	allowedTypes := []string{"image/jpeg", "image/png", "image/gif"}
	if err := utils.ValidateFileType(file, allowedTypes); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Delete old image if it exists
	if product.ImagePath != "" {
		utils.DeleteFile(product.ImagePath)
	}

	// Upload new image
	imagePath, err := utils.UploadFile(c, file, "products")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
		return
	}

	// Update product with new image path
	product.ImagePath = imagePath
	if err := pc.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	// Return product response
	c.JSON(http.StatusOK, gin.H{"product": product.ToResponse()})
} 