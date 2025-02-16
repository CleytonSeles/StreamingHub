import axios from 'axios';

export const getPlaylists = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/playlists');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar playlists:', error);
    return [];
  }
};
