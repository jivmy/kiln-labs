import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const animationRef = useRef(null);
  const prevVolumeRef = useRef(0);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMicActive(true);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 1024; // Increased for more detailed frequency data
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        
        // Smooth out the volume changes
        const smoothedVolume = prevVolumeRef.current * 0.8 + avgVolume * 0.2;
        setVolume(smoothedVolume);
        prevVolumeRef.current = smoothedVolume;

        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }).catch((err) => {
      console.error('Microphone access error:', err);
      alert('Failed to access the microphone. Please allow access and try again.');
    });
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Dynamically calculate scale and glow
  const scale = 1 + (volume / 128) * 0.5; // Smoother scaling
  const glow = Math.min(20, Math.max(0, volume / 5)); // Add a glow effect

  return (
    <div
      style={{
        position: 'relative',
        width: '100%', // Take the full width of the parent container
        height: '100%', // Take the full height of the parent container
        backgroundColor: 'hsl(0, 0%, 98%)', // Super pale gray
        borderRadius: 'inherit', // Match the parent's border radius if it has one
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Orb */}
      <div
        style={{
          width: '50%', // Orb takes 50% of the container's width
          height: '50%', // Orb is a square based on the container's height
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, 80%)`, // Pale yellow color
          transform: `scale(${scale})`,
          transition: 'transform 0.1s ease, background-color 0.1s ease',
          boxShadow: `0 0 ${glow}px ${glow}px rgba(255, 255, 200, 0.5)`, // Soft yellow glow
        }}
      ></div>
  
      {/* Button */}
      <button
        onClick={requestMicrophone}
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '8%',
          width: '10%', // Button scales with container
          height: '10%',
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
        {/* Microphone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          viewBox="0 0 24 24"
          width="60%" // SVG scales dynamically
          height="60%"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
    </div>
  );  
}

export default SoundResponsiveOrb;
