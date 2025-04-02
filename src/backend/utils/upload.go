package utils

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// UploadFile saves a file to disk and returns the file path
func UploadFile(c *gin.Context, file *multipart.FileHeader, folder string) (string, error) {
	// Get the file extension
	ext := filepath.Ext(file.Filename)
	
	// Generate a unique filename
	filename := uuid.New().String() + ext
	
	// Create the directory path
	dirPath := filepath.Join("uploads", folder)
	if err := os.MkdirAll(dirPath, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}
	
	// Create the file path
	filePath := filepath.Join(dirPath, filename)
	
	// Save the file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}
	
	// Return the relative path to be stored in the database
	return "/" + filePath, nil
}

// ValidateFileType checks if the file's MIME type is in the allowedTypes list
func ValidateFileType(file *multipart.FileHeader, allowedTypes []string) error {
	contentType := file.Header.Get("Content-Type")
	
	for _, allowedType := range allowedTypes {
		if contentType == allowedType {
			return nil
		}
	}
	
	return fmt.Errorf("invalid file type: %s", contentType)
}

// DeleteFile removes a file from disk
func DeleteFile(filePath string) error {
	// Remove the leading slash if present
	cleanPath := strings.TrimPrefix(filePath, "/")
	
	// Check if the file exists
	if _, err := os.Stat(cleanPath); os.IsNotExist(err) {
		return nil // File doesn't exist, nothing to delete
	}
	
	// Delete the file
	return os.Remove(cleanPath)
} 