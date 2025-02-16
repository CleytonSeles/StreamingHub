import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      {/* Exibe a miniatura do vídeo */}
      <img src={video.thumbnail} alt={video.title} />
      {/* Exibe o título do vídeo */}
      <h3>{video.title}</h3>
      {/* Exibe a descrição do vídeo */}
      <p>{video.description}</p>
    </div>
  );
};

export default VideoCard;



