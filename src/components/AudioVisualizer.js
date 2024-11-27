import React, { useEffect, useRef, useState } from "react";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const [audioSource, setAudioSource] = useState(null);

  useEffect(() => {
    const mp3Path = require("../sample.mp3"); // Adjust the path to your mp3 file

    const audio = new Audio(mp3Path);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256; // 8-bit style
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    setAudioSource(audio);
    audioContextRef.current = { analyser, audioContext };

    return () => {
      audioContext.close();
    };
  }, []);

  useEffect(() => {
    if (!audioSource || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyser = audioContextRef.current.analyser;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "lime";
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0; // Normalize to 0-2
        const y = (v - 1) * (canvas.height / 4) + canvas.height / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      requestAnimationFrame(draw);
    };

    audioSource.play();
    draw();

    return () => {
      audioSource.pause();
    };
  }, [audioSource]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{ display: "block", margin: "0 auto", border: "1px solid black" }}
      />
    </div>
  );
};

export default AudioVisualizer;
