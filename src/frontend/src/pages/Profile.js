import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Profile = () => {
  const { user, updateProfile, uploadProfileImage } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Verificar se as senhas coincidem se uma delas for preenchida
    if (
      (formData.password || formData.confirmPassword) &&
      formData.password !== formData.confirmPassword
    ) {
      setLoading(false);
      return setError("As senhas não coincidem");
    }

    // Preparar dados para envio (omitir confirmPassword)
    const updateData = {
      name: formData.name,
    };

    // Só incluir senha se foi preenchida
    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      // Chamar API para atualizar perfil
      await updateProfile(updateData);
      setSuccess("Perfil atualizado com sucesso!");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err);
      setError(
        "Falha ao atualizar perfil. Verifique seus dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log(
      "Arquivo selecionado:",
      file.name,
      "tipo:",
      file.type,
      "tamanho:",
      file.size
    );

    // Validar tipo do arquivo
    if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setError("Formato de arquivo não suportado. Use JPEG, PNG ou GIF.");
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Arquivo muito grande. O tamanho máximo é 5MB.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Criar um novo FormData
      const formData = new FormData();

      // Adicionar o arquivo com o nome esperado pelo backend
      formData.append("image", file);

      // Log para debug
      console.log("FormData criado com arquivo:", file.name);
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Fazer o upload da imagem
      await uploadProfileImage(formData);

      console.log("Upload da imagem concluído com sucesso");
      setSuccess("Foto atualizada com sucesso!");
      setOpenSnackbar(true);
    } catch (err) {
      console.error("Erro ao fazer upload da imagem:", err);
      console.error("Detalhes do erro:", err.response?.data);
      setError(
        err.response?.data?.error || "Falha ao atualizar a foto de perfil."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h4" gutterBottom>
          Seu Perfil
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                }}
              >
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "primary.main",
                  }}
                  alt={user?.name}
                  src={user?.imagePath}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
                <IconButton
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    right: 0,
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                  component="label"
                  aria-label="upload picture"
                >
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <PhotoCameraIcon />
                </IconButton>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                Membro desde{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                  : ""}
              </Typography>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Nome Completo"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    disabled
                    helperText="O email não pode ser alterado"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Alteração de Senha (deixe em branco para manter a senha
                    atual)
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="password"
                    label="Nova Senha"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    label="Confirmar Nova Senha"
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ mt: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Salvar Alterações"
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={success}
      />
    </Container>
  );
};

export default Profile;
