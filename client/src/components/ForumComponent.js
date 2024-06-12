import React, { useState, useEffect } from 'react';
import Header from './Header';
import "./CSS/ForumComponent.css"
import profilePhoto from "../images/profile_photo.webp";

const ForumComponent = ({handleLogout}) => {

    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fonction pour récupérer tous les messages
    const fetchMessages = async () => {
        try {
            const response = await fetch('http://localhost:4000/apimessages/messages');
            const data = await response.json();

            console.log(data.message)

            const dataWithResponses = [];
            for (const messageInfo of data.message) {
                try {
                    if (messageInfo.reply_to === 0) {
                        const response2 = await fetch(`http://localhost:4000/apimessages/user/${messageInfo.userID}/messages/${messageInfo.messageID}/reply`);
                        const data2 = await response2.json();
    
                        dataWithResponses.push({...messageInfo, replies: data2.replies});
                    }
                    
                } catch (error) {
                    console.log("Erreur lors de la récupération des réponses : " + error);
                }
            }

            setMessages(dataWithResponses.reverse());
            console.log(dataWithResponses)
        } catch (error) {
            console.error(error);
        }
    };

    // Fonction pour poster un nouveau message
    const postNewMessage = async () => {
        try {
            const response = await fetch(`http://localhost:4000/apimessages/user/${userId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: newMessage }),
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Erreur lors de la publication du message:', error);
        }
    };

    // Fonction pour répondre à un message existant
    const replyToMessage = async (parentMessageId, contentMessage) => {
        try {
            const response = await fetch(`http://localhost:4000/apimessages/user/${userId}/messages/${parentMessageId}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: contentMessage }),
            });

            
            if (response.ok) {
                console.log(response)
                setReplyMessage('');
                setReplyingTo(null);
                fetchMessages();
            }
        } catch (error) {
            console.error('Erreur lors de la réponse au message:', error);
        }
    };
    
    const searchMessages = async () => {
        if (searchQuery === "") {
            fetchMessages();
            return;
        }
        try {
            const response = await fetch(`http://localhost:4000/apimessages/messages/search/${searchQuery}`);
            
            if (response.ok) {
                const data = await response.json();
                setMessages(data.message.reverse());
            }
        } catch (error) {
            console.error('Erreur lors de la recherche de messages :', error);
        }
    };

    useEffect(() => {
        const savedUserData = JSON.parse(sessionStorage.getItem('userData'));
        setIsAdmin(savedUserData.admin);
        setUserId(savedUserData.id);

        fetchMessages();
    }, []);

    return (
        <div className="forum-component">
            <Header isConnected={true} handleLogout={handleLogout} isAdmin={isAdmin} />
            <h2>Forum</h2>
            <div className="new-message-form">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Poster un nouveau message..."
                />
                <button onClick={postNewMessage}>Poster</button>
                
            </div>

            <div className="search-form">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des messages..."
                />
                <button onClick={searchMessages}>Rechercher</button>
            </div>

            <div className="messages-list">
                {messages?.map((message) => (
                    <div key={message._id} className="message-item">
                        
                        <p>{message.message}</p>
                        <p><img src={profilePhoto} alt='--' /> {message.firstname} {message.lastname}</p>
                        {!replyingTo && <button onClick={() => setReplyingTo(message.messageID)}>Répondre</button>}
                        

                        {replyingTo === message.messageID && (
                            <div className="reply-form">
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Écrivez votre réponse..."
                                />
                                <button onClick={() => replyToMessage(message.messageID, replyMessage)}>Envoyer</button>
                            </div>
                        )}

                        {message.replies?.map((reply) => (
                            <div key={reply._id} className="message-item">
                                <p>{reply.message}</p>
                                <p><img src={profilePhoto} alt='--' /> {reply.firstname} {reply.lastname}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ForumComponent;
