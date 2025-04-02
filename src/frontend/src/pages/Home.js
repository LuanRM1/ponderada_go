import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          pt: 8,
          pb: 6,
          textAlign: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Gerenciador de Produtos
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          Adicione, edite e organize seus produtos com facilidade.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to="/products"
              >
                Ver Produtos
              </Button>
            </Grid>
            {user && (
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/products/new"
                  startIcon={<AddIcon />}
                >
                  Adicionar Produto
                </Button>
              </Grid>
            )}
            {!user && (
              <Grid item>
                <Button
                  variant="outlined"
                  size="large"
                  component={RouterLink}
                  to="/login"
                >
                  Entrar
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
