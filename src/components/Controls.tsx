import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isPlaying, onPlayPause, onReset }) => {
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
