import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

// Create authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios defaults
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user data if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/users/me");
        setUser(response.data.user);
        setError(null);
      } catch (err) {
        console.error("Error loading user:", err);
        setError("Failed to authenticate");
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register a new user
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const { token: newToken } = response.data;

      // Defina o token no localStorage e no estado
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Carregue os dados do usuário com o novo token
      const userResponse = await api.get("/users/me");
      setUser(userResponse.data.user);

      setError(null);
      return userResponse.data.user;
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login a user
  const login = async (loginData) => {
    setLoading(true);
    try {
      // Verificando se loginData tem email e password
      if (!loginData || !loginData.email || !loginData.password) {
        throw new Error("Email e senha são obrigatórios");
      }

      console.log("Login payload:", {
        email: loginData.email,
        password: "****",
      });

      const response = await api.post("/auth/login", loginData);
      console.log("Login response:", response.data);

      if (!response.data || !response.data.token) {
        throw new Error("Token not found in response");
      }

      const { token: newToken } = response.data;

      // Defina o token no localStorage e no estado
      localStorage.setItem("token", newToken);
      setToken(newToken);

      // Carregue os dados do usuário com o novo token
      const userResponse = await api.get("/users/me");
      console.log("User response:", userResponse.data);

      setUser(userResponse.data.user);

      setError(null);
      return userResponse.data.user;
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await api.put("/users/me", userData);
      setUser(response.data.user);
      setError(null);
      return response.data.user;
    } catch (err) {
      console.error("Update profile error:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to update profile";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Upload profile image
  const uploadProfileImage = async (formData) => {
    setLoading(true);
    try {
      console.log("Iniciando upload da imagem de perfil");

      // Verificar se formData contém a imagem
      console.log(
        "Conteúdo do FormData:",
        Array.from(formData.entries()).map(
          (entry) => `${entry[0]}: ${entry[1].name || entry[1]}`
        )
      );

      // Importante: não definir Content-Type para multipart/form-data
      // O Axios irá configurar automaticamente com o boundary correto
      const response = await api.post("/users/me/image", formData);

      console.log("Resposta do upload de imagem:", response.data);

      setUser(response.data.user);
      setError(null);
      return response.data.user;
    } catch (err) {
      console.error("Upload image error:", err);
      console.error("Detalhes do erro:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.error || "Failed to upload image";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    uploadProfileImage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
