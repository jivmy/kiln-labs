import React from 'react';
import SoundResponsiveOrb from '../components/SoundResponsiveOrb';

const projects = [
  {
    title: 'Sound Orb',
    description: 'Orb that responds to sound input.',
  },
];

const ProjectSection = ({ date, title, description, children }) => (
  <section className="w-full flex flex-col items-center gap-6">
    <div className="w-full flex flex-col items-start gap-2">
      <span className="w-full text-black text-xs font-bold opacity-30 font-sans">
        {date}
      </span>
      <h2 className="w-full text-black text-2xl font-normal font-sans">{title}</h2>
      <p className="w-full text-black text-sm font-normal opacity-30 font-sans">
        {description}
      </p>
    </div>
    <div className="w-full flex justify-center items-center">
      {/* Aspect Ratio Container */}
      <div
        className="w-full relative"
        style={{
          paddingTop: '100%', // 1:1 aspect ratio
          borderRadius: '40px',
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
          {children}
        </div>
      </div>
    </div>
  </section>
);

const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-white flex justify-center items-center py-20 px-2 sm:px-0">
      <div className="w-full max-w-md flex flex-col items-start gap-12">
        {/* Header Section */}
        <header className="w-full flex flex-col items-start gap-2">
          <h1 className="text-black text-2xl font-normal leading-[30px] tracking-[0.8px] opacity-50 font-sans">
            Jimmy Shan
          </h1>
          <p className="text-black text-2xl font-normal leading-9 font-sans">
            Designer crafting a more playful internet from New York City.
          </p>
        </header>

        {/* Project Sections */}
        {projects.map((project, index) => (
          <ProjectSection
            key={index}
            title={project.title}
            description={project.description}
          >
            {index === 0 && <SoundResponsiveOrb />} {/* Place Sound Orb in the first project */}
          </ProjectSection>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
