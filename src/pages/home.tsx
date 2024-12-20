import React, { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    console.log('Home component mounted');
  }, []);

  return (
    <div className="wrapper">
      <h1 className="header">Crafting playful interfaces from New York City.</h1>
      <div className="demo"></div>
      <h1 className="header">Now—running, egg-noodles, morning dew. </h1>
    </div>
  );
};

export default Home;
