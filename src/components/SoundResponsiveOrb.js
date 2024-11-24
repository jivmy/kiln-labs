import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const requestMicrophone = () => {
    if (micActive) {
      // Turn off microphone
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setMicActive(false);
      setVolume(0);
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // Turn on microphone
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      streamRef.current = stream;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      analyser.fftSize = 256;
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Boosted sensitivity for scale
        const amplifiedVolume = Math.min(100, avgVolume * 5); // Amplified by factor of 5
        setVolume((prev) => prev * 0.7 + amplifiedVolume * 0.3); // Smooth transition

        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
      setMicActive(true);
    }).catch(() => alert('Microphone access denied.'));
  };

  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Adjusted scaling for better responsiveness
  const scale = 1 + (micActive ? volume / 10 : 0.2); // More responsive scale factor
  const colorLightness = Math.min(95, 90 - volume / 20); // Keep pale tones only

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
          width: '15%', // Smaller base size for room to grow
          height: '15%',
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, ${colorLightness}%)`, // Pale yellow tones
          transform: `scale(${scale})`,
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          animation: micActive ? 'pulse 1s infinite ease-in-out' : 'none',
          boxShadow: `0 0 10px 10px rgba(255, 255, 200, 0.5)`, // Static glow effect
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
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66-1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>
    </div>
  );
}

export default SoundResponsiveOrb;
