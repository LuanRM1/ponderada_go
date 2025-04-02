import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import productService from "../services/productService";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        // Mostrar apenas os 6 produtos mais recentes
        setProducts(data?.slice(0, 6) || []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container>
      <Box
        sx={{
          textAlign: "center",
          py: 6,
          background: "linear-gradient(45deg, #3f51b5 30%, #f50057 90%)",
          color: "white",
          borderRadius: 2,
          mb: 6,
        }}
      >
        <Typography component="h1" variant="h2" gutterBottom>
          Gerenciador de Produtos
        </Typography>
        <Typography variant="h5" paragraph>
          Crie e gerencie seus produtos com facilidade
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/products"
            size="large"
            sx={{ mr: 2 }}
          >
            Ver Produtos
          </Button>
          {user && (
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/products/create"
              size="large"
              startIcon={<AddIcon />}
            >
              Adicionar Produto
            </Button>
          )}
        </Box>
      </Box>

      <Typography component="h2" variant="h4" gutterBottom sx={{ mb: 4 }}>
        Produtos Recentes
      </Typography>

      {loading ? (
        <Typography>Carregando produtos...</Typography>
      ) : (
        <Grid container spacing={4}>
          {products.length > 0 ? (
            products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardActionArea
                    component={RouterLink}
                    to={`/products/${product.id}`}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {product.description && product.description.length > 100
                          ? `${product.description.substring(0, 100)}...`
                          : product.description}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        R$ {product.price?.toFixed(2) || "0.00"}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography>Nenhum produto disponível.</Typography>
            </Grid>
          )}
        </Grid>
      )}

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={RouterLink}
          to="/products"
          size="large"
        >
          Ver Todos os Produtos
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
