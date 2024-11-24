import React, { useEffect, useState, useRef } from 'react';

function SoundResponsiveOrb() {
  const [volume, setVolume] = useState(0);
  const [micActive, setMicActive] = useState(false);
  const [notes, setNotes] = useState([]);
  const animationRef = useRef(null);
  const prevVolumeRef = useRef(0);

  const requestMicrophone = () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      setMicActive(true);
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      analyser.fftSize = 512; // Smaller FFT size for more sensitivity
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const avgVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Increase sensitivity by amplifying the volume calculation
        const amplifiedVolume = Math.min(100, avgVolume * 1.5);

        // Smooth out the volume changes
        const smoothedVolume = prevVolumeRef.current * 0.8 + amplifiedVolume * 0.2;
        setVolume(smoothedVolume);
        prevVolumeRef.current = smoothedVolume;

        // Generate music notes when volume exceeds a threshold
        if (micActive && smoothedVolume > 10) {
          generateNote();
        }

        animationRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }).catch((err) => {
      console.error('Microphone access error:', err);
      alert('Failed to access the microphone. Please allow access and try again.');
    });
  };

  const generateNote = () => {
    const id = Math.random().toString(36).substr(2, 9); // Unique ID for the note
    const note = {
      id,
      size: Math.random() * 20 + 10, // Random size between 10px and 30px
      opacity: Math.random() * 0.5 + 0.5, // Random opacity between 0.5 and 1
      x: Math.random() * 200 - 100, // Random x-axis movement
      y: Math.random() * 200 - 100, // Random y-axis movement
    };

    console.log('Generated Note:', note); // Debugging note creation

    setNotes((prevNotes) => [...prevNotes, note]);

    // Remove the note after animation (3 seconds)
    setTimeout(() => {
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Dynamically calculate scale, color, and glow
  const scale = micActive ? 0.5 + (volume / 100) * 1.5 : 1; // Default size 1 before mic input
  const glow = micActive ? Math.min(30, volume / 5) : 10; // Default glow when inactive
  const colorLightness = micActive ? 90 - (volume / 100) * 40 : 80; // Pale yellow before mic input

  return (
    <div
      style={{
        position: 'relative',
        width: '100%', // Take the full width of the parent container
        height: '100%', // Take the full height of the parent container
        backgroundColor: 'hsl(0, 0%, 98%)', // Super pale gray background
        borderRadius: 'inherit', // Match the parent's border radius
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Prevent notes from breaking outside
      }}
    >
      {/* Orb */}
      <div
        style={{
          width: '50%', // Orb size based on the container
          height: '50%',
          borderRadius: '50%',
          backgroundColor: `hsl(50, 100%, ${colorLightness}%)`, // Dynamic pale yellow
          transform: `scale(${scale})`,
          transition: 'transform 0.2s ease, background-color 0.2s ease',
          boxShadow: `0 0 ${glow}px ${glow}px rgba(255, 255, 200, 0.5)`, // Glow effect
        }}
      ></div>

      {/* Music Notes */}
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            position: 'absolute',
            width: `${note.size}px`,
            height: `${note.size}px`,
            backgroundColor: 'rgba(255, 215, 0, 0.8)', // Golden yellow for notes
            borderRadius: '50%',
            opacity: note.opacity,
            transform: `translate(${note.x}px, ${note.y}px)`,
            animation: 'float 3s ease-out',
            border: '1px solid black', // Debugging visibility
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

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: translate(0, -150px) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default SoundResponsiveOrb;
