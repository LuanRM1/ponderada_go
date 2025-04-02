import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ProductForm from "../components/ProductForm";
import api from "../services/api";

const ProductEdit = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      setError("");
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setError("Falha ao carregar os dados do produto para edição.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: "md", mx: "auto", py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          Voltar para Produtos
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ maxWidth: "md", mx: "auto", py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Produto não encontrado
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
        >
          Voltar para Produtos
        </Button>
      </Box>
    );
  }

  return <ProductForm product={product} mode="edit" />;
};

export default ProductEdit;
