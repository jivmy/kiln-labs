import React from 'react';

const Controls = ({ isPlaying, onPlayPause, onReset }) => {
  return (
    <div className="absolute bottom-4 w-full flex justify-center space-x-4">
      <button
        onClick={onPlayPause}
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button
        onClick={onReset}
        className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;
