// src/pages/Skills.jsx
import React from 'react';

const skills = [
  { name: 'HTML', icon: '🌐' },
  { name: 'CSS', icon: '🎨' },
  { name: 'JavaScript', icon: '🟨' },
  { name: 'React.js', icon: '⚛️' },
  { name: 'Node.js', icon: '🌱' },
  { name: 'Express.js', icon: '🚂' },
  { name: 'MongoDB', icon: '🍃' },
  { name: 'Python', icon: '🐍' },
  { name: 'Git', icon: '🔧' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Socket.io', icon: '📡' },
  { name: 'Tailwind CSS', icon: '💨' },
];

const Skills = () => {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Skills</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {skills.map((skill, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-4 border rounded-xl shadow hover:shadow-lg transition duration-300"
          >
            <div className="text-4xl mb-2">{skill.icon}</div>
            <p className="text-lg font-medium">{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
