// src/pages/Projects.jsx
import React from 'react';

// Export the projects array
export const projects = [
  {
    title: 'Cropwise',
    description: 'An ML-powered farm assistant recommending crops, fertilizers, and irrigation techniques.',
    technologies: ['React', 'Express', 'MongoDB', 'Python', 'Scikit-learn'],
    link: 'https://github.com/pprasoon1/cropwise',
  },
  {
    title: 'Realtime Code Editor',
    description: 'An online IDE with collaborative editing, Docker-based execution, and terminal support.',
    technologies: ['Monaco Editor', 'Node.js', 'MongoDB', 'Socket.io', 'Docker'],
    link: 'https://github.com/pprasoon1/code-editor',
  },
  // Add more projects here
];

// Keep your existing Projects component
const Projects = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 text-sm mb-3">
              {project.technologies.map((tech, i) => (
                <span
                  key={i}
                  className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full border border-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
