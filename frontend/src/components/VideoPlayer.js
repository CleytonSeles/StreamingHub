import React from 'react';

const VideoPlayer = ({ video }) => {
  return (
    <div className="video-player">
      {/* Renderiza o player de vídeo com controles */}
      <video controls>
        {/* Fonte do vídeo, utilizando a URL fornecida */}
        <source src={video.url} type="video/mp4" />
        {/* Mensagem exibida caso o navegador não suporte a tag de vídeo */}
        Your browser does not support the video tag.
      </video>
      {/* Exibe o título do vídeo */}
      <h3>{video.title}</h3>
      {/* Exibe a descrição do vídeo */}
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;

