import React from 'react';
import './home.css';

function Home() {
  const projects = [
    { label: 'Kalipso Brand', number: '001' },
    { label: '—', number: '002' },
    { label: '—', number: '003' },
    { label: '—', number: '004' },
    { label: '—', number: '005' },
    { label: '—', number: '006' },
    { label: '—', number: '007' },
    { label: '—', number: '008' },
    { label: '—', number: '009' }
  ];

  return (
    <div className="container">
      <div className="header-text">
        Crafting a more playful internet from New York City—some of my creativity lives on this website.
      </div>

      <div className="grid">
        {projects.map((project, index) => (
          <div key={index} className="grid-item">
            <div className="image-placeholder"></div>
            <div className="item-info">
              <div className="item-label">{project.label}</div>
              <div className="item-number">{project.number}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
