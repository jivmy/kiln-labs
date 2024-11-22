import React from 'react';

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-20 px-2 sm:px-0">
      <div className="w-full max-w-md flex flex-col items-start gap-12">
        {/* Header Section */}
        <header className="w-full flex flex-col items-start gap-2">
          <h1 className="text-black text-2xl font-normal leading-[30px] tracking-[0.8px] opacity-50 font-['SF_Pro','sans-serif']">
            Jimmy Shan
          </h1>
          <p className="text-black text-2xl font-medium leading-9 font-['SF_Pro','sans-serif']">
            Designer crafting a more playful internet from New York City.
          </p>
        </header>

        {/* Project Sections */}
        {['Sound Button', 'Incoming...'].map((project, index) => (
          <section key={index} className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col items-start gap-2">
              <span className="w-full text-black text-xs font-bold opacity-30 font-['SF_Pro','sans-serif']">
                {index === 0 ? '11/22/24' : '11/23/24'}
              </span>
              <h2 className="w-full text-black text-2xl font-normal font-['SF_Pro','sans-serif']">
                {project}
              </h2>
              <p className="w-full text-black text-sm font-normal opacity-30 font-['SF_Pro','sans-serif']">
                {index === 0
                  ? 'Button that responds to sound input.'
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

