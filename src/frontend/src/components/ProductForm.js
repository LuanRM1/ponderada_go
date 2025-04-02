import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UploadIcon from "@mui/icons-material/Upload";
import api from "../services/api";

const ProductForm = ({ product, mode = "create" }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imagePath: "",
    quantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (product && mode === "edit") {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        imagePath: product.imagePath || "",
        quantity: product.quantity || "",
      });

      if (product.imagePath) {
        // Converter o caminho relativo para URL completa para preview
        const imageUrl = product.imagePath.startsWith("http")
          ? product.imagePath
          : `/api${product.imagePath}`;
        setImagePreview(imageUrl);
      }
    }
  }, [product, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData({
      ...formData,
      imagePath: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validar campos
      if (!formData.name || !formData.price) {
        throw new Error("Nome e preço são obrigatórios.");
      }

      // Se estiver criando um produto novo e tiver uma imagem, primeiro envie a imagem
      if (mode === "create" && imageFile) {
        // 1. Criar o produto primeiro
        const payload = {
          ...formData,
          price: Number(formData.price),
          quantity: Number(formData.quantity || 0),
        };

        console.log("Enviando produto:", payload);

        const createResponse = await api.post("/products", payload);
        const newProductId = createResponse.data.product.id;

        if (!newProductId) {
          throw new Error("Não foi possível obter o ID do produto criado");
        }

        // 2. Enviar a imagem para o produto recém-criado
        console.log("Enviando imagem para o produto ID:", newProductId);
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const imageResponse = await api.post(
          `/products/${newProductId}/image`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Resposta do upload de imagem:", imageResponse.data);

        navigate("/products");
        return;
      }

      // Fluxo para edição de produto existente ou criação sem imagem
      let productId;

      const payload = {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity || 0),
      };

      if (mode === "edit" && product) {
        const response = await api.put(`/products/${product.id}`, payload);
        productId = product.id;
      } else {
        const response = await api.post("/products", payload);
        productId = response.data.product.id;
      }

      // Se tiver um arquivo de imagem para modo edit, fazer o upload
      if (imageFile && productId && mode === "edit") {
        const formData = new FormData();
        formData.append("image", imageFile);
        await api.post(`/products/${productId}/image`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/products");
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Ocorreu um erro ao salvar o produto. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {mode === "edit" ? "Editar Produto" : "Novo Produto"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome do Produto"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                required
                fullWidth
                id="price"
                label="Preço"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="quantity"
                label="Quantidade"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                label="Descrição"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                Imagem do Produto
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  sx={{ flexShrink: 0 }}
                >
                  {imageFile ? "Alterar Imagem" : "Enviar Imagem"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>

                {imageFile && (
                  <Typography variant="body2" color="text.secondary">
                    Arquivo selecionado: {imageFile.name}
                  </Typography>
                )}
              </Box>
            </Grid>

            {imagePreview && (
              <Grid item xs={12}>
                <Card>
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={imagePreview}
                      alt="Prévia da imagem"
                      sx={{ height: 200, objectFit: "contain" }}
                    />
                    <IconButton
                      color="error"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      onClick={handleRemoveImage}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/products")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : mode === "edit" ? (
                    "Atualizar Produto"
                  ) : (
                    "Criar Produto"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductForm;
