import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>StreamingHub</h2>
      <ul>
        {/* Link para a página inicial */}
        <li><Link to="/">Home</Link></li>
        {/* Link para a página de registro */}
        <li><Link to="/register">Registrar</Link></li>
        {/* Link para a página de login */}
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;

