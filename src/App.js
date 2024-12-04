import React, { useState, useEffect, useRef } from 'react';
import AmplitudeVisualizer from './components/AmplitudeVisualizer';
import FrequencyVisualizer from './components/FrequencyVisualizer';
import WaveformVisualizer from './components/WaveformVisualizer';
import song from './assets/suno.mp3';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [audioData, setAudioData] = useState({
    amplitude: 0,
    frequency: [],
    waveform: [],
  });
  const [showVisuals, setShowVisuals] = useState(true);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const frequencyDataRef = useRef(null);
  const timeDomainDataRef = useRef(null);

  useEffect(() => {
    // Set the background color inline
    document.documentElement.style.backgroundColor = '#0E0808';
    document.body.style.backgroundColor = '#0E0808';

    if (!audioContextRef.current) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);
      timeDomainDataRef.current = new Uint8Array(analyser.fftSize);
    }
  }, []);

  useEffect(() => {
    const updateData = () => {
      if (!analyserRef.current || !frequencyDataRef.current || !timeDomainDataRef.current) return;

      const frequencyData = frequencyDataRef.current;
      const timeDomainData = timeDomainDataRef.current;

      analyserRef.current.getByteFrequencyData(frequencyData);
      analyserRef.current.getByteTimeDomainData(timeDomainData);

      const amplitude = frequencyData.reduce((sum, value) => sum + value, 0) / frequencyData.length;
      const frequency = [...frequencyData];
      const waveform = [...timeDomainData];

      setAudioData({ amplitude, frequency, waveform });

      if (isPlaying) requestAnimationFrame(updateData);
    };

    if (isPlaying) {
      updateData();
    }
  }, [isPlaying]);

  const handlePlay = async () => {
    const audioContext = audioContextRef.current;
    const audioElement = audioRef.current;

    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      setButtonClicked(true); 
      setTimeout(() => {
        audioElement.play(); 
        setIsPlaying(true); 
      }, 300);
    } catch (error) {
      console.error('Error starting audio playback:', error);
    }
  };

  const handleSongEnd = () => {
    setIsPlaying(false); 
    setShowVisuals(false); 
    setTimeout(() => {
      setButtonClicked(false); 
      setShowVisuals(true); 
    }, 500); 
  };

  return (
    <div className="relative flex items-center justify-center w-full h-screen">
      <audio
        ref={audioRef}
        src={song}
        preload="auto"
        onEnded={handleSongEnd} 
      ></audio>

      {!isPlaying ? (
        <div
          className={`rounded-full border-4 border-white flex items-center justify-center cursor-pointer transition-transform duration-150 ${
            buttonClicked ? 'scale-0' : 'scale-100'
          }`}
          style={{ width: '100px', height: '100px' }}
          onClick={handlePlay}
        >
          <div
            className="border-l-4 border-r-4 border-transparent"
            style={{
              width: '0',
              height: '0',
              marginLeft: '8px',
              borderTop: '15px solid transparent',
              borderBottom: '15px solid transparent',
              borderLeft: '25px solid white',
            }}
          ></div>
        </div>
      ) : (
        showVisuals && (
          <div
            className="visual-wrapper"
            style={{
              maxWidth: '90vw',
              maxHeight: '90%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <AmplitudeVisualizer amplitudeData={audioData.amplitude} />
            <FrequencyVisualizer frequencyData={audioData.frequency} />
            <WaveformVisualizer waveformData={audioData.waveform} />
          </div>
        )
      )}
    </div>
  );
};

export default App;
