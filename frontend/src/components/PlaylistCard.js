import React from 'react';

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="playlist-card">
      <h3>{playlist.name}</h3>
      <p>{playlist.description}</p>
    </div>
  );
};

export default PlaylistCard;
