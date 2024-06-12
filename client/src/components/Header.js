import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Header.css';

const Header = ({ isConnected, handleLogout, isAdmin }) => {
    return (
        <header className="header">

            <div className="logo">
                <h1><Link style={{textDecoration: "none", color: "black"}} to="/">Organiz'asso</Link></h1>
                
            </div>

            <nav>
                <ul className="nav-list">

                    {isConnected ? (
                        <>  
                        
                            {isAdmin && <li>
                                <button ><Link to="/admin">Panneau Admin</Link></button>
                                
                            </li>}
                            
                            <li>
                                <button ><Link to="/profile">Profil</Link></button>
                                
                            </li>
                            <li>
                                <button onClick={handleLogout}>Déconnexion</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <Link to="/login">Connexion</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
