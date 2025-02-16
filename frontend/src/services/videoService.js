import axios from 'axios';

// Função para buscar todos os vídeos
export const getVideos = async () => {
  try {
    // Envia uma requisição GET para a rota de vídeos
    const response = await axios.get('http://localhost:5000/api/videos');
    // Retorna os dados da resposta da API
    return response.data;
  } catch (error) {
    // Exibe um erro no console caso a requisição falhe
    console.error('Erro ao buscar vídeos:', error);
    // Retorna um array vazio em caso de erro
    return [];
  }
};
