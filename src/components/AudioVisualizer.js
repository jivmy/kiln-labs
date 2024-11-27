import React, { useRef, useEffect, useState } from "react";

const AudioVisualizer = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);

  useEffect(() => {
    if (audioRef.current && !audioContext) {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = context.createAnalyser();
      analyser.fftSize = 2048;

      const source = context.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(context.destination);

      const frequencyData = new Uint8Array(analyser.frequencyBinCount);
      setAudioContext({ context, analyser, frequencyData });

      const render = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        analyser.getByteFrequencyData(frequencyData);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = canvas.width / frequencyData.length;
        frequencyData.forEach((value, i) => {
          const barHeight = value;
          const x = i * barWidth;
          ctx.fillStyle = `rgb(${value}, 50, 150)`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        });

        requestAnimationFrame(render);
      };

      render();
    }
  }, [audioRef, audioContext]);

  return (
    <div>
      <audio ref={audioRef} src="/path/to/your/audio/file.mp3" controls />
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
};

export default AudioVisualizer;
