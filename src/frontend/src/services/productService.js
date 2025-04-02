import axios from "axios";

// Get all products
const getAllProducts = async () => {
  try {
    const response = await axios.get("/api/products");
    return response.data.products;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch products");
  }
};

// Get product by ID
const getProductById = async (id) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data.product;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch product");
  }
};

// Create new product
const createProduct = async (productData) => {
  try {
    const response = await axios.post("/api/products", productData);
    return response.data.product;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create product");
  }
};

// Update product
const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`/api/products/${id}`, productData);
    return response.data.product;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update product");
  }
};

// Delete product
const deleteProduct = async (id) => {
  try {
    await axios.delete(`/api/products/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to delete product");
  }
};

// Upload product image
const uploadProductImage = async (id, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axios.post(`/api/products/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.product;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to upload product image"
    );
  }
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
};

export default productService;
