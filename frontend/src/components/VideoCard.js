import React from 'react';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <img src={video.thumbnail} alt={video.title} />
      <h3>{video.title}</h3>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoCard;


