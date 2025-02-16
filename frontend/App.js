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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const videosData = await getVideos();
      console.log('Videos:', videosData);
      const playlistsData = await getPlaylists();
      console.log('Playlists:', playlistsData);
      setVideos(videosData);
      setPlaylists(playlistsData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Bem-vindo ao StreamingHub</h1>
      <div className="videos">
        {videos.map((video) => (
          <div key={video._id}>
            <VideoCard video={video} />
            <VideoPlayer video={video} />
          </div>
        ))}
      </div>
      <div className="playlists">
        {playlists.map((playlist) => (
          <PlaylistCard key={playlist._id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default App;






