import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Pranay Prasoon
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/projects" 
              className={`${isActive('/projects') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              Projects
            </Link>
            <Link 
              to="/blogs" 
              className={`${isActive('/blogs') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
            >
              Blog
            </Link>
            {user ? (
              <Link 
                to="/chat" 
                className={`${isActive('/chat') ? 'text-blue-600' : 'text-gray-600'} hover:text-blue-500 transition-colors`}
              >
                Chat
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
