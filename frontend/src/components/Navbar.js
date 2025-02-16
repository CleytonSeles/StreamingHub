import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
return (
    <nav className="navbar">
    <h2>StreamingHub</h2>
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/register">Registrar</Link></li>
        <li><Link to="/login">Login</Link></li>
    </ul>
    </nav>
);
};

export default Navbar;
