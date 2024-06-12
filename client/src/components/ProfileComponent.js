import React, { useState, useEffect } from 'react';
import { getUser, getUserMessages, deleteUserMessage, deleteUserAccount } from '../services/UserService';
import Header from './Header';
import "./CSS/ProfileComponent.css"

const ProfileComponent = ({handleLogout}) => {
    const [profile, setProfile] = useState(null);
    const [messages, setMessages] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

    useEffect(() => {
        const savedUserData = JSON.parse(sessionStorage.getItem('userData'));
    
        if (savedUserData) {
            setIsAdmin(savedUserData.admin);
            setUserId(savedUserData.id);
            setProfile(savedUserData)
        }
    }, []);

    useEffect(() => {


        const fetchProfile = async () => {
            try {
                const userProfile = await getUser(userId);
                setProfile(userProfile);
            } catch (error) {
                console.error('Erreur lors de la récupération du profil de l\'utilisateur :', error);
            }

            try {
                const messagesUser = await getUserMessages(userId);
                console.log(messagesUser)

                setMessages(messagesUser)
            } catch (error) {
                console.error('Erreur lors de la récupération des messages de l\'utilisateur :', error);
            }
        };

        
        if (userId !== null) {
            fetchProfile();
        }
        
    }, [userId]);

    const handleDeleteMessage = async (messageId) => {
        try {
            await deleteUserMessage(userId, messageId);

            try {
                const messagesUser = await getUserMessages(userId);
                setMessages(messagesUser)
            } catch (error) {
                console.error('Erreur lors de la récupération des messages de l\'utilisateur :', error);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du message :', error);
        }
    };

    const handleOpenConfirmation = () => {
        setIsConfirmationOpen(true);
    };

    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUserAccount(userId);

            handleLogout();
        } catch (error) {
            console.error('Erreur lors de la suppression du compte :', error);
        } finally {
            handleCloseConfirmation();
        }
    };

    return (

        <div className='profile-component'>
            <Header isConnected={true} handleLogout={handleLogout} isAdmin={isAdmin} />
            <h2>Profil de {profile?.firstname} {profile?.lastname}</h2>
            <div>
                <h3>Messages publiés :</h3>

                {messages?.map((message) => (
                    <div key={message.messageID} className='message-item'>
                        <p>{message.message}</p>
                        <button style={{background: "#e74c3c"}} onClick={() => handleDeleteMessage(message.messageID)}>Supprimer</button>
                    </div>
                ))}

            </div>

            <button style={{background: "#e74c3c", marginTop: "10px"}} onClick={handleOpenConfirmation}>
                Supprimer le compte
            </button>

            {isConfirmationOpen && (
                <div className='confirmation-modal'>
                    <div className='modal-content'>
                        <h3>Confirmer la suppression du compte</h3>
                        <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
                        <div className='modal-buttons'>
                            <button onClick={handleCloseConfirmation}>Annuler</button>
                            <button style={{background: "#e74c3c"}} onClick={handleDeleteAccount}>Supprimer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileComponent;
