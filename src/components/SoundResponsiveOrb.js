import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const animationRef = useRef(null);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(Math.min(100, avgVolume * 2)); // Boost sensitivity
        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
      setMicActive(true);
    }).catch(() => alert('Microphone access denied.'));
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const scale = 1 + (micActive ? volume / 150 : 0.2); // Dynamic size
  const glow = micActive ? volume / 2 : 10; // Dynamic glow intensity
  const colorLightness = Math.min(95, 90 - volume / 10); // Keep pale values only

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'hsl(0, 0%, 98%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      {/* Orb */}
      <div
        style={{
          position: 'relative',
          width: '25%',
          height: '25%',
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, ${colorLightness}%)`, // Soft yellow tones
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          animation: micActive ? 'pulse 1s infinite ease-in-out' : 'none',
          boxShadow: `0 0 ${glow}px ${glow}px rgba(255, 255, 200, 0.5)`,
        }}
      ></div>

      {/* Microphone Button */}
      <button
        onClick={requestMicrophone}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: micActive ? '#4CAF50' : '#2196F3',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 ${glow}px ${glow}px rgba(255, 255, 200, 0.5);
            }
            50% {
              box-shadow: 0 0 ${glow * 1.5}px ${glow * 1.5}px rgba(255, 255, 200, 0.8);
            }
          }
        `}
      </style>
    </div>
  );
}

export default SoundResponsiveOrb;
