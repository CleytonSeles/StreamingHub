import axios from 'axios';

export const getVideos = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/videos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    return [];
  }
};
