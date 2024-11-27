import React, { useEffect, useRef, useState } from "react";

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Dynamically resolve the path to the MP3 file
    const audioFilePath = require("../sample.mp3").default;

    const audioElement = new Audio(audioFilePath);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyserNode = audioCtx.createAnalyser();
    const audioSource = audioCtx.createMediaElementSource(audioElement);

    analyserNode.fftSize = 256;
    audioSource.connect(analyserNode);
    analyserNode.connect(audioCtx.destination);

    setAudio(audioElement);
    setAudioContext(audioCtx);
    setAnalyser(analyserNode);

    return () => {
      audioCtx.close(); // Cleanup
    };
  }, []);

  const startAudio = () => {
    if (!audio || !audioContext || !analyser) return;

    audioContext.resume().then(() => {
      audio.play();
      setIsPlaying(true);
      visualize();
    }).catch((err) => {
      console.error("Audio playback error:", err);
    });
  };

  const visualize = () => {
    if (!canvasRef.current || !analyser) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
        const v = dataArray[i] / 128.0;
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

      if (isPlaying) {
        requestAnimationFrame(draw);
      }
    };

    draw();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        style={{ display: "block", margin: "0 auto", border: "1px solid black" }}
      />
      {!isPlaying && (
        <button
          onClick={startAudio}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          Start Audio
        </button>
      )}
    </div>
  );
};

export default AudioVisualizer;
