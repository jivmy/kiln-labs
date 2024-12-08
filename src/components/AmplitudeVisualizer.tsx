import React from 'react';

interface OpacityVisualizerProps {
  amplitudeData: number;
}

const OpacityVisualizer: React.FC<OpacityVisualizerProps> = ({ amplitudeData }) => {
  if (!amplitudeData) {
    return null;
  }

  // Set the opacity to change more subtly with a higher threshold for amplitude
  const opacity = Math.min(1, Math.max(0.1, amplitudeData * 0.008)); // Lower multiplier for slower fade

  return (
    <div
      className="absolute"
      style={{
        width: '50px',
        height: '50px',
        backgroundColor: '#FFFACD',
        borderRadius: '50%',
        opacity: opacity,
        transition: 'opacity 0.3s ease',
      }}
    ></div>
  );
};

export default OpacityVisualizer;
