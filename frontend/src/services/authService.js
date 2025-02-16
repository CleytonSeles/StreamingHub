import api from '../api';

// Função para registrar um novo usuário
export const register = async (userData) => {
  // Envia uma requisição POST para a rota de registro com os dados do usuário
  const response = await api.post('/auth/register', userData);
  // Retorna os dados da resposta da API
  return response.data;
};

// Função para fazer login de um usuário
export const login = async (userData) => {
  // Envia uma requisição POST para a rota de login com os dados do usuário
  const response = await api.post('/auth/login', userData);
  // Retorna os dados da resposta da API
  return response.data;
};
