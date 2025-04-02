import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const NotFound = () => {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h1" fontWeight="bold" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Página Não Encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        A página que você está procurando pode ter sido removida, teve seu nome
        alterado ou está temporariamente indisponível.
      </Typography>
      <Box>
        <Button
          variant="contained"
          component={RouterLink}
          to="/"
          startIcon={<HomeIcon />}
          size="large"
        >
          Voltar para a Página Inicial
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
