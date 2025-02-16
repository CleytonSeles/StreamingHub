import React from 'react';

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="playlist-card">
      {/* Exibe o nome da playlist */}
      <h3>{playlist.name}</h3>
      {/* Exibe a descrição da playlist */}
      <p>{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
