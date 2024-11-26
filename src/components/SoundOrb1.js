import React, { useState, useRef } from 'react'


function SoundOrb1() {

  const [micActive, setMicActive] = useState(false);
  const micStreamRef = useRef(null);

  const requestMicrophone = () => {
    if (micActive) {
      // Turn off microphone
      console.log('Turning off the microphone...');
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop);
        micStreamRef.current = null; // Clear the stream reference
      }
      setMicActive(false);
      return;
    }
  
    console.log('Requesting microphone access...');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        micStreamRef.current = stream;
        setMicActive(true);
        console.log('Microphone access granted.');
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
          width: '15%',
          height: '15%',
          borderRadius: '50%',
          backgroundColor: 'hsl(50, 100%, 88%)',
        }}
      ></div>

      {/* Button */}
      <button onClick={requestMicrophone}
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
        </svg>      </button>
    </div>
  )
}

export default SoundOrb1;