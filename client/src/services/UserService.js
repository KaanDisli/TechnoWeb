
// Fonction pour obtenir les informations d'un utilisateur par ID
export async function getUser(userId) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}/profile`);
    
    if (response.ok) {

        return response.json();
    } else {
        throw new Error('Erreur lors de l\'obtention de l\'utilisateur');
    }
}

export async function deleteUserAccount(userId) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        console.log(response)
        return response.json();
    } else {
        throw new Error('Erreur lors de la validation de l\'utilisateur');
    }
}


// Fonction pour supprimer un message de l'utilisateur
export async function deleteUserMessage(userId, messageID) {
    const response = await fetch(`http://localhost:4000/apimessages/user/${userId}/messages`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messageID: messageID,
        }),
    });
    
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Erreur lors de la suppression du message');
    }
}

export async function getUserMessages(userId) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}`);
    
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Erreur lors de la récupération des messages');
    }
}


