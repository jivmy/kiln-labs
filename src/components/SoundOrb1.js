import React, { useState, useRef, useEffect } from 'react';

function SoundOrb1() {
  const [micActive, setMicActive] = useState(false);
  const [orbScale, setOrbScale] = useState(1); // Scale for the orb size
  const micStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const animationFrameRef = useRef(null); // To manage the animation loop

  const processAudioData = () => {
    if (!analyserNodeRef.current) return;

    const analyser = analyserNodeRef.current;

    // Frequency data
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);
    console.log('Frequency data:', frequencyData);

    // Amplitude (time domain) data
    const timeDomainData = new Uint8Array(analyser.fftSize);
    analyser.getByteTimeDomainData(timeDomainData);

    // Calculate average amplitude (loudness)
    const sum = timeDomainData.reduce((a, b) => a + b, 0);
    const averageAmplitude = sum / timeDomainData.length;

    // Scale orb size based on loudness (normalized between 0.5 and 2)
    const normalizedScale = 0.5 + (averageAmplitude / 128); // Normalize amplitude
    setOrbScale(normalizedScale);

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(processAudioData);
  };

  const requestMicrophone = () => {
    if (micActive) {
      // Turn off microphone
      console.log('Turning off the microphone...');
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close(); // Clean up AudioContext
        audioContextRef.current = null;
        analyserNodeRef.current = null;
      }
      cancelAnimationFrame(animationFrameRef.current); // Stop animation loop
      setOrbScale(1); // Reset orb size
      setMicActive(false);
      return;
    }

    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        micStreamRef.current = stream;
        setMicActive(true);
        console.log('Microphone access granted.');

        // Step 1: Create AudioContext
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        // Step 2: Feed the microphone stream into AudioContext
        const source = audioContext.createMediaStreamSource(stream);

        // Step 3: Create AnalyserNode
        const analyser = audioContext.createAnalyser();
        analyserNodeRef.current = analyser;

        // Step 4: Connect source to analyser
        source.connect(analyser);

        // Step 5: Configure AnalyserNode (optional for better visuals)
        analyser.fftSize = 256; // Determines data resolution
        analyser.smoothingTimeConstant = 0.8; // Smooths out changes

        // Step 6: Start processing audio data
        animationFrameRef.current = requestAnimationFrame(processAudioData);
      })
      .catch((error) => {
        console.error('Microphone access denied:', error);
      });
  };

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
      }}
    >
      {/* Orb */}
      <div
        style={{
          width: `${15 * orbScale}%`, // Dynamically scale orb size
          height: `${15 * orbScale}%`,
          borderRadius: '50%',
          backgroundColor: 'hsl(50, 100%, 88%)',
          transition: 'transform 0.1s ease',
        }}
      ></div>

      {/* Button */}
      <button
        onClick={requestMicrophone}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          padding: '12px',
          fontSize: '16px',
          backgroundColor: micActive ? '#4CAF50' : '#2196F3',
          transition: 'background-color 0.3s ease',
          color: '#FFF',
          border: 'none',
          borderRadius: '100%',
          cursor: 'pointer',
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

export default SoundOrb1;
