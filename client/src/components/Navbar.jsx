import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex gap-6 p-4 bg-gray-900 text-white">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/experience">Experience</Link>
      <Link to="/blogs">Blog</Link>
      <Link to="/chat">Chat</Link>
    </nav>
  );
};

export default Navbar;
