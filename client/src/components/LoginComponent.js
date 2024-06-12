import React, { useState } from 'react';
import { login, createUser } from '../services/AuthService';
import Header from './Header';
import './CSS/LoginComponent.css';


const LoginComponent = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Gestion de la connexion
    const handleLogin = async () => {
        try {
            const user = await login(username, password);
            
            console.log(user)

            props.handleLogin(user);
            
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            console.log(error)
            setErrorMessage('' + error);
            setPassword("")
            setConfirmPassword("")
        }
    };

    // Gestion de l'inscription
    const handleSignup = async () => {
        try {
            await createUser(username, password, confirmPassword, lastname, firstname);
            setIsSignup(false);
            setPassword("")
            setConfirmPassword("")
        } catch (error) {
            console.log(error)
            setErrorMessage('Veuillez vérifier les informations fournies.');
            setPassword("")
            setConfirmPassword("")
        }
    };


    const initialise =  (sign) => {
        setUsername("")
        setFirstname("")
        setLastname("")
        setPassword("")
        setConfirmPassword("")
        setIsSignup(sign)
    }

    return (
        <div >
            <Header isConnected={false} />
            <div className="login-container">

                <h2>{isSignup ? 'Inscription' : 'Connexion'}</h2>
                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
                {isSignup && (
                    <>
                        <input
                            type="text"
                            placeholder="Prénom"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Nom"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        <input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                         />
                        <input
                            type="password"
                            placeholder="Confirmez le mot de passe"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </>
                )}
                {!isSignup && (
                    <>
                        <input
                            type="text"
                            placeholder="Nom d'utilisateur"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>

                )}
                <button onClick={isSignup ? handleSignup : handleLogin}>
                    {isSignup ? "S'inscrire" : "Se connecter"}
                </button>
                <p>
                    {isSignup ? (
                        <>
                            Déjà inscrit ? <button onClick={() => initialise(false)}>Se connecter</button>
                        </>
                    ) : (
                        <>
                            Pas encore inscrit ? <button onClick={() => initialise(true)}>S'inscrire</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default LoginComponent;
