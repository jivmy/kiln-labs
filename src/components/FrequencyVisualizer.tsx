import React, { useState, useEffect } from 'react';

interface FrequencyVisualizerProps {
  frequencyData: number[];
}

const FrequencyVisualizer: React.FC<FrequencyVisualizerProps> = ({ frequencyData }) => {
  // Always call hooks unconditionally
  const width = 500;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxAmplitude = Math.max(...frequencyData);
  const maxRadius = Math.min(width, height) / 2 - 20;
  const angleStep = (2 * Math.PI) / frequencyData.length;

  // Declare state and effects at the top level
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const animateRotation = () => {
      setRotation((prevRotation) => (prevRotation + 0.01) % (2 * Math.PI)); // Increment rotation
      requestAnimationFrame(animateRotation); // Keep rotating
    };
    animateRotation(); // Start rotation animation
  }, []); // Empty dependency ensures this effect only runs once

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${centerX}, ${centerY}) rotate(${(rotation * 180) / Math.PI})`}>
        {frequencyData.map((value, index) => {
          const angle = index * angleStep;
          const radius = Math.min((value / maxAmplitude) * 200, maxRadius);
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          // Simulate depth effect by adjusting size based on position
          const z = (index / frequencyData.length) * 100;
          const radiusSize = Math.min(z / 20, 20);

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={radiusSize}
              fill="#FFEFD5"
              opacity={0.7}
            />
          );
        })}
      </g>
    </svg>
  );
};

export default FrequencyVisualizer;
