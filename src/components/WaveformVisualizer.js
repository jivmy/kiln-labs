import React from 'react';

const WaveformVisualizer = ({ waveformData }) => {
  if (!Array.isArray(waveformData) || waveformData.length === 0) {
    return null; // Handle empty or invalid data gracefully
  }

  const waveformIntensity =
    waveformData.reduce((sum, value) => sum + Math.abs(value - 128), 0) / waveformData.length;
  const glowSize = Math.max(150, waveformIntensity * 28);

  return (
    <div
      className="absolute rounded-full"
      style={{
        width: `${glowSize}px`,
        height: `${glowSize}px`,
        border: '4px solid #FFFACA',
        boxShadow: `0 0 15px 5px rgba(255, 218, 185, ${waveformIntensity / 255})`,
        opacity: 0.5,
        transition: 'width 0.3s ease, height 0.3s ease, box-shadow 0.3s ease',
      }}
    ></div>
  );
};

export default WaveformVisualizer;
