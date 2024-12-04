import React from 'react';

const AmplitudeVisualizer = ({ amplitudeData }) => {
  if (!amplitudeData) {
    return null; // Handle missing or invalid data gracefully
  }

  // Smoothed scaling based on average amplitude
  const amplitudeSize = Math.max(50, amplitudeData * 1.5); // Reduced multiplier for gradual scaling

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${amplitudeSize}px`,
        height: `${amplitudeSize}px`,
        backgroundColor: '#FFFACD', // Light pale yellow
        transition: 'width 0.3s ease, height 0.3s ease', // Smooth scaling
      }}
    ></div>
  );
};

export default AmplitudeVisualizer;
