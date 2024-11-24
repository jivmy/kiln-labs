import React, { useEffect, useState } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMicActive(true);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setVolume(avgVolume);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }).catch((err) => {
      console.error('Microphone access error:', err);
      alert('Failed to access the microphone. Please allow access and try again.');
    });
  };

  const saturation = Math.min(50, Math.max(20, volume/ 0.2));

  return (
    <div
      style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        backgroundColor: '#D9D9D9',
        borderRadius: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Orb */}
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: `hsl(50, ${saturation}%, 50%)`,
          transition: 'background-color 0.1s ease',
        }}
      ></div>

      {/* Button */}
      <button
        onClick={requestMicrophone}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {/* Play Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}

export default SoundResponsiveOrb;
