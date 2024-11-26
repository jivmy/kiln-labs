import React, { useEffect, useState, useRef } from 'react';

function SoundOrb0() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  const previousVolumeRef = useRef(0); // Track the previous volume

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

        // Relative change
        const volumeChange = Math.abs(avgVolume - previousVolumeRef.current);
        previousVolumeRef.current = avgVolume;

        // Combine magnitude and relative change for sensitivity
        const combinedVolume = avgVolume * 0.8 + volumeChange * 0.5; // Boosted response
        setVolume((prev) => prev * 0.4 + combinedVolume * 0.6); // Smoother but sensitive

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

  // Outer orb scale: More responsive
  const scale = 1 + (micActive ? volume / 15 : 0.2); // Increased sensitivity
  const colorLightness = Math.min(95, 90 - volume / 15); // Keep pale tones, more responsive

  // Inner orb scale: Smooth and higher sensitivity
  const normalizedVolume = Math.min(1, volume / 75); // Normalize volume
  const innerScale =
    micActive && volume > 1 ? 0.3 + Math.pow(normalizedVolume, 0.7) * 1.8 : 0; // Higher response

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
      {/* Outer Orb */}
      <div
        style={{
          position: 'relative',
          width: '15%',
          height: '15%',
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, ${colorLightness}%)`, // Pale yellow tones
          transform: `scale(${scale})`,
          transition: 'transform 0.1s ease, background-color 0.1s ease',
          boxShadow: `0 0 10px 10px rgba(255, 255, 200, 0.5)`,
        }}
      >
        {/* Inner Orb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '30%', // Smaller size for inner orb
            height: '30%',
            transform: `translate(-50%, -50%) scale(${innerScale})`,
            borderRadius: '50%',
            backgroundColor: `hsl(50, 100%, ${colorLightness - 10}%)`, // Slightly darker yellow
            transition: 'transform 0.2s ease', // Smooth scaling
          }}
        ></div>
      </div>

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
    </div>
  );
}

export default SoundOrb0;
