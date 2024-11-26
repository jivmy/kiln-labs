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
          backgroundColor: 'hsl(50, 100%, 70%)',
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
          backgroundColor: '#2196F3',
          color: '#FFF',
          border: 'none',
          borderRadius: '100%',
          cursor: 'pointer',
        }}
      >
        Toggle Mic
      </button>
    </div>
  )
}

export default SoundOrb1;