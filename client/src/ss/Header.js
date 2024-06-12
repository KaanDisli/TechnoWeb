import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/">Accueil</Link>
        <Link to="/forum">Forum</Link>
        <Link to="/profile">Profil</Link>
        <Link to="/login">Connexion</Link>
      </nav>
    </header>
  );
};

export default Header;
