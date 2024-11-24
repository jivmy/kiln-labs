import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const animationRef = useRef(null);
  const prevVolumeRef = useRef(0);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMicActive(true);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 256; // Smaller FFT size for more sensitivity
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Increase sensitivity dramatically
        const amplifiedVolume = Math.min(150, avgVolume * 5);

        // Smooth out the volume changes
        const smoothedVolume = prevVolumeRef.current * 0.6 + amplifiedVolume * 0.4;
        setVolume(smoothedVolume);
        prevVolumeRef.current = smoothedVolume;

        // Generate particles when volume exceeds a very low threshold
        if (micActive && smoothedVolume > 1) {
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
    const newParticles = Array.from({ length: Math.ceil(volume / 10) }, () => ({
      id: Math.random().toString(36).substr(2, 9),
      size: Math.random() * 8 + 2, // Random size between 2px and 10px
      x: 0, // Start at the orb's center
      y: 0,
      dx: (Math.random() - 0.5) * 6, // Random x-direction velocity
      dy: (Math.random() - 0.5) * 6, // Random y-direction velocity
      opacity: 1, // Start fully visible
    }));

    setParticles((prevParticles) => [...prevParticles, ...newParticles]);

    // Remove particles after their lifespan (2 seconds)
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
          x: p.x + p.dx * 2, // Move particle in x-direction
          y: p.y + p.dy * 2, // Move particle in y-direction
          opacity: Math.max(0, p.opacity - 0.05), // Gradually fade out
        }))
      );
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

  // Dynamically calculate scale, color, glow, and rotation
  const scale = micActive ? 0.8 + (volume / 100) * 2 : 1; // Default size before mic input
  const glow = micActive ? Math.min(50, volume / 2) : 10; // Glow intensity
  const rotation = micActive ? volume * 0.5 : 0; // Rotate sun rays dynamically
  const colorLightness = micActive ? 90 - (volume / 150) * 40 : 80; // Pale yellow

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: 'hsl(0, 0%, 98%)', // Super pale gray background
        borderRadius: 'inherit',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Orb / Sun */}
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
        {micActive &&
          Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '10%',
                height: '40%',
                backgroundColor: 'rgba(255, 200, 0, 0.8)',
                transform: `rotate(${i * 30 + rotation}deg) translate(150%, 0)`,
                transformOrigin: 'center top',
                borderRadius: '50%',
              }}
            ></div>
          ))}
      </div>

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: 'rgba(255, 200, 0, 0.8)', // Bright yellow
            borderRadius: '50%',
            opacity: particle.opacity,
            transform: `translate(${particle.x}px, ${particle.y}px)`,
            pointerEvents: 'none',
          }}
        ></div>
      ))}

      {/* Button */}
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
        {/* Microphone Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="#FFF"
          viewBox="0 0 24 24"
          width="60%"
          height="60%"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
    </div>
  );
}

export default SoundResponsiveOrb;
