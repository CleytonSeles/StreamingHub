import React from 'react';

const VideoPlayer = ({ video }) => {
  return (
    <div className="video-player">
      <video controls>
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <h3>{video.title}</h3>
      <p>{video.description}</p>
    </div>
  );
};

export default VideoPlayer;
