import React from 'react';

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-20">
      <div className="w-full max-w-md flex flex-col items-start gap-12">
        {/* Header Section */}
        <header className="w-full flex flex-col items-start gap-2">
          <h1 className="text-black text-2xl font-normal leading-[30px] tracking-[0.8px] opacity-50 font-['SF_Pro_Display']">
            Jimmy Shan
          </h1>
          <p className="text-black text-2xl font-medium leading-9 font-['SF_Pro_Display']">
            Designer crafting a more playful internet from New York City.
          </p>
        </header>

        {/* Project Sections */}
        {['Sound Orb', 'Incoming...'].map((project, index) => (
          <section key={index} className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-start gap-2">
              <span className="w-full text-black text-xs font-bold opacity-30 font-['SF_Pro']">
                {index === 0 ? 'DAY 01' : 'DAY 02'}
              </span>
              <h2 className="w-full text-black text-2xl font-normal font-['SF_Pro']">
                {project}
              </h2>
              <p className="w-full text-black text-sm font-normal opacity-30 font-['SF_Pro']">
                {index === 0
                  ? 'Orb that responds to sound input.'
                  : 'Hold your horses...'}
              </p>
            </div>
            <div className="w-full h-[400px] bg-[#D9D9D9] opacity-20 rounded-[40px]" />
          </section>
        ))}
      </div>
    </div>
  );
};

export default HomePage;