import React from 'react';
import BreathingCircles from '../components/BreathingCircles';

const Home = () => {
  return (
    <div className="wrapper">
      <h1 className="header">Crafting playful interfaces from New York City.</h1>
      <div 
        className="demo" 
        style={{ 
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          backgroundColor: 'transparent',
        }}
      >
        <BreathingCircles />
      </div>
      <h1 className="header">Now—running, egg-noodles, morning dew. </h1>
    </div>
  );
};

export default Home;
