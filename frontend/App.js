import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Register from './src/components/Register';
import Login from './src/components/Login';
import VideoCard from './src/components/VideoCard';
import PlaylistCard from './src/components/PlaylistCard';
import VideoPlayer from './src/components/VideoPlayer';
import { getVideos } from './src/services/videoService';
import { getPlaylists } from './src/services/playlistService';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Rota para a página de registro */}
        <Route path="/register" element={<Register />} />
        {/* Rota para a página de login */}
        <Route path="/login" element={<Login />} />
        {/* Rota para a página inicial */}
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  // Define o estado para armazenar os vídeos e playlists
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // Função para buscar vídeos e playlists ao montar o componente
  useEffect(() => {
    const fetchData = async () => {
      // Busca os dados dos vídeos
      const videosData = await getVideos();
      console.log('Videos:', videosData);
      // Busca os dados das playlists
      const playlistsData = await getPlaylists();
      console.log('Playlists:', playlistsData);
      // Atualiza o estado com os dados recebidos
      setVideos(videosData);
      setPlaylists(playlistsData);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao StreamingHub</h1>
      <div className="videos">
        {/* Renderiza os vídeos */}
        {videos.map((video) => (
          <div key={video._id}>
            <VideoCard video={video} />
            <VideoPlayer video={video} />
          </div>
        ))}
      </div>
      <div className="playlists">
        {/* Renderiza as playlists */}
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default App;






