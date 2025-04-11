// src/pages/About.jsx
import React from 'react';

const About = () => {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <img
        src="/aiImg.jpg"
        alt="Your Name"
        className="w-32 h-32 rounded-full object-cover mb-4"
      />
      <p className="text-lg">
        Hi! I'm Pranay Prasoon, a passionate full-stack developer and Data Scientist. I'm skilled in React.js, Node.js, and MongoDB as well as sklearn, numpy, pandas, tensorflow, and keras.
        I love building modern web applications and learning new technologies. This portfolio showcases my projects, blogs, and a place to chat with me in real-time!
      </p>
    </div>
  );
};

export default About;
