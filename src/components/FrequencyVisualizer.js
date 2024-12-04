import React from 'react';

const FrequencyVisualizer = ({ frequencyData }) => {
  if (!Array.isArray(frequencyData) || frequencyData.length === 0) {
    return null; // Handle empty or invalid data gracefully
  }

  // Calculate peak frequency or average of top bands
  const peakFrequency = frequencyData.slice(0, 10).reduce((sum, value) => sum + value, 0) / 10; // Focus on low-frequency bands
  const ringSize = Math.max(100, peakFrequency * 4); // Increased multiplier for sharper peaks

  return (
    <div
      className="absolute rounded-full border-4"
      style={{
        width: `${ringSize}px`,
        height: `${ringSize}px`,
        borderColor: '#FFEFD5', // Medium pale yellow
        transition: 'width 0.3s ease, height 0.3s ease', // Smooth scaling
      }}
    ></div>
  );
};

export default FrequencyVisualizer;
