import axios from 'axios';

// Cria uma instância do axios com uma configuração base
const api = axios.create({
  // Define a URL base para todas as requisições
  baseURL: 'http://localhost:5000/api',
});

// Exporta a instância do axios para ser utilizada em outras partes da aplicação
export default api;
