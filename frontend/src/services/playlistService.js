import axios from 'axios';

// Função para buscar todas as playlists
export const getPlaylists = async () => {
  try {
    // Envia uma requisição GET para a rota de playlists
    const response = await axios.get('http://localhost:5000/api/playlists');
    // Retorna os dados da resposta da API
    return response.data;
  } catch (error) {
    // Exibe um erro no console caso a requisição falhe
    console.error('Erro ao buscar playlists:', error);
    // Retorna um array vazio em caso de erro
    return [];
  }
};

