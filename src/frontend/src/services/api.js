import axios from "axios";

// Configurar axios
const api = axios.create({
  baseURL: "/api",
});

// Adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptar respostas para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratar erro de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Limpar token e redirecionar para login se necessário
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
