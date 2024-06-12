import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import AdminComponent from './components/AdminComponent';
import ForumComponent from './components/ForumComponent';
import LoginComponent from './components/LoginComponent';
import ProfileComponent from './components/ProfileComponent';
import './App.css';

function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null)


    // Gestion de la connexion de l'utilisateur
    const handleLogin = (loginData) => {

        setIsAuthenticated(true);
        setUserData(loginData);
        console.log(loginData);
        
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userData', JSON.stringify(loginData));
    };

    // Gestion de la déconnexion de l'utilisateur
    const handleLogout = () => {
        // Logique de déconnexion ici
        setIsAuthenticated(false);
        setUserData(null);
        
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userData');
    };

    return (
        <Router>
            <div className="App">



                <Routes>
                {/* Rediriger vers / si non connecté */}
                {!isAuthenticated && <Route path="/" element={<LoginComponent handleLogin={handleLogin} />} />}

                {/* Page du forum */}
                {isAuthenticated && <Route path="/" element={<ForumComponent handleLogout={handleLogout} />} />}

                {/* Page de profil */}
                {isAuthenticated && <Route path="/profile" element={<ProfileComponent handleLogout={handleLogout} />} />}

                {/* Page admin (réservée aux administrateurs) */}
                {isAuthenticated && userData.admin && (
                    <Route path="/admin" element={<AdminComponent handleLogout={handleLogout}/>} />
                )}

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/" /> } />
            </Routes>

                    
   
            </div>
        </Router>
    );
}

export default App;
