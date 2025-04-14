import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { projects } from './Projects';  // Import the projects array instead of the component

const Home = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="h-screen flex items-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Hi, I'm Pranay Prasoon
              </h1>
              <p className="text-xl text-gray-600">
                Full Stack Developer & Data Scientist passionate about building modern web applications
                and implementing machine learning solutions.
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/projects"
                  className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  View Projects
                </Link>
                <Link
                  to="/contact"
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Contact Me
                </Link>
              </div>
              <div className="flex space-x-4 pt-4">
                <a href="https://github.com/pprasoon1" target="_blank" rel="noopener noreferrer">
                  <FaGithub className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </a>
                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </a>
                <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0">
              <img
                src="/aiImg.jpg"
                alt="Pranay Prasoon"
                className="w-64 h-64 md:w-96 md:h-96 rounded-full object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects?.slice(0, 3).map((project, idx) => (  // Add optional chaining
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-sm rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Project →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;