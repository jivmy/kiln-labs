import React from 'react';

const projects = [
  {
    date: '11/22/24',
    title: 'Sound Orb',
    description: 'Orb that responds to sound input.',
  },
];

const ProjectSection = ({ date, title, description }) => (
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
    <div className="w-full h-[400px] bg-[#D9D9D9] opacity-20 rounded-[40px]" />
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
            date={project.date}
            title={project.title}
            description={project.description}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
