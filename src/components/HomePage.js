import React from 'react';
import SoundResponsiveOrb from './SoundResponsiveOrb';

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-20 px-2 sm:px-0">
      <div className="w-full max-w-md flex flex-col items-start gap-12">
     
          <header className="w-full flex flex-col items-start gap-2">
            <p className="text-black text-3xl font-normal leading-9 font-sans">
              Crafting a more playful internet from New York City — designer, prototyper, and <em>Suno</em> rapper.
            </p>
          </header>

          {/* Orb Section */}
        <div className="w-full flex justify-center items-center">
          <div
            className="w-full relative"
            style={{
              paddingTop: '100%', // 1:1 aspect ratio
              borderRadius: '24px',
              backgroundColor: '#f3f3f3', // Optional background for visibility
              overflow: 'hidden',
            }}
          >
            <div
              className="absolute inset-0 flex justify-center items-center"
              style={{
                borderRadius: 'inherit', // Matches the outer container’s border-radius
              }}
            >
              <SoundResponsiveOrb />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
