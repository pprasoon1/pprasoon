// src/pages/Experience.jsx
import React from 'react';

const experiences = [
  {
    title: 'Full Stack Developer Intern',
    company: 'TechLabs India',
    duration: 'June 2023 - Sept 2023',
    description: 'Worked on developing REST APIs and modern UI components using React and Express. Improved performance and usability across the platform.',
  },
  {
    title: 'Open Source Contributor',
    company: 'GirlScript Summer of Code',
    duration: 'Feb 2023 - April 2023',
    description: 'Contributed to open-source projects. Fixed bugs and implemented new features using JavaScript and Git workflows.',
  },
  {
    title: 'Campus Ambassador',
    company: 'Coding Ninjas',
    duration: '2022 - 2023',
    description: 'Promoted technical learning and coordinated student coding events on campus.',
  },
];

const Experience = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Experience</h1>
      <div className="relative border-l-4 border-blue-500 pl-6">
        {experiences.map((exp, index) => (
          <div key={index} className="mb-10 relative">
            <div className="absolute -left-3 top-1 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
            <h2 className="text-xl font-semibold">{exp.title}</h2>
            <h3 className="text-gray-700">{exp.company}</h3>
            <p className="text-sm text-gray-500 mb-2">{exp.duration}</p>
            <p className="text-gray-800">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
