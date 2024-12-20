import React, { useEffect } from 'react';
import DustMoteRain from '../components/DustMoteRain';

const Home = () => {
  useEffect(() => {
    console.log('Home component mounted');
    const demoDiv = document.querySelector('.demo') as HTMLDivElement;
    console.log('Demo div dimensions:', {
      width: demoDiv?.offsetWidth,
      height: demoDiv?.offsetHeight
    });
  }, []);

  return (
    <div className="wrapper">
      <h1 className="header">Crafting playful interfaces from New York City.</h1>
      <div 
        className="demo" 
        style={{ 
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          border: '2px solid blue', // Debug border
        }}
      >
        <DustMoteRain />
      </div>
      <h1 className="header">Now—running, egg-noodles, morning dew. </h1>
    </div>
  );
};

export default Home;
