import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef(null);
  const prevVolumeRef = useRef(0);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMicActive(true);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        const amplifiedVolume = Math.min(100, avgVolume * 3);
        const smoothedVolume = prevVolumeRef.current * 0.7 + amplifiedVolume * 0.3;
        setVolume(smoothedVolume);
        prevVolumeRef.current = smoothedVolume;

        if (micActive && smoothedVolume > 2) {
          generateParticles(smoothedVolume);
        }

        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }).catch((err) => {
      console.error('Microphone access error:', err);
      alert('Failed to access the microphone. Please allow access and try again.');
    });
  };

  const generateParticles = (volume) => {
    const newParticles = Array.from({ length: Math.ceil(volume / 5) }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      size: Math.random() * 10 + 5,
      x: 0,
      y: 0,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      opacity: 1,
    }));

    setParticles((prevParticles) => [...prevParticles, ...newParticles]);

    setTimeout(() => {
      setParticles((prevParticles) =>
        prevParticles.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 2000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: p.x + p.dx * 2,
          y: p.y + p.dy * 2,
          opacity: Math.max(0, p.opacity - 0.05),
        }))
      );
      setRotation((prevRotation) => prevRotation + 1); // Slow and smooth rotation
    }, 50);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const scale = micActive ? 0.5 + (volume / 100) * 1.5 : 1;
  const glow = micActive ? Math.min(30, volume / 5) : 10;
  const colorLightness = micActive ? 90 - (volume / 100) * 40 : 80;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsl(0, 0%, 98%)',
        overflow: 'hidden',
        borderRadius: 'inherit',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '50%',
          height: '50%',
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, ${colorLightness}%)`,
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          boxShadow: `0 0 ${glow}px ${glow}px rgba(255, 255, 200, 0.5)`,
        }}
      >
        {/* Sun Rays */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: '5%',
              height: '20%',
              backgroundColor: 'rgba(255, 200, 0, 0.8)',
              transform: `rotate(${i * 45 + rotation}deg) translateY(-2git0%)`,
              transformOrigin: '100px 60px', // Rotate from the center of the orb
              borderRadius: '5px',
            }}
          ></div>
        ))}
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: 'rgba(255, 200, 0, 0.8)',
            borderRadius: '50%',
            opacity: particle.opacity,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            pointerEvents: 'none',
          }}
        ></div>
      ))}

      <button
        onClick={requestMicrophone}
        style={{
          position: 'absolute',
          bottom: '8%',
          right: '8%',
          width: '10%',
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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          viewBox="0 0 24 24"
          width="60%"
          height="60%"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66-1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
    </div>
  );
}

export default SoundResponsiveOrb;
