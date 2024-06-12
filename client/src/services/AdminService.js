// Fonction pour obtenir tous les utilisateurs
export async function getUsers(userId) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}/admin`);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error('Erreur lors de la récupération des utilisateurs');
    }
}

// Fonction pour mettre à jour le rôle d'un utilisateur
export async function updateUserRole(userId, userId2, role) {
    if (role == "membre") {
        const response = await fetch(`http://localhost:4000/api/user/${userId}/admin/${userId2}/removeAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erreur lors de la mise à jour du rôle de l\'utilisateur');
        }
    } else {
        const response = await fetch(`http://localhost:4000/api/user/${userId}/admin/${userId2}/setAdmin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Erreur lors de la mise à jour du rôle de l\'utilisateur');
        }
    }
    
}

// Fonction pour valider l'inscription d'un utilisateur
export async function validateUser(userId, userId2) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}/admin/${userId2}/confirmed`, {
        method: 'POST'
    });
    
    if (response.ok) {
        console.log(response)
        return response.json();
    } else {
        throw new Error('Erreur lors de la validation de l\'utilisateur');
    }
}

// Fonction pour supprimer un utilisateur par ID
export async function deleteUser(userId, userId2) {
    const response = await fetch(`http://localhost:4000/api/user/${userId}/admin/${userId2}`, {
        method: 'DELETE'
    });
    
    if (response.ok) {
        console.log(response)
        return response.json();
    } else {
        throw new Error('Erreur lors de la validation de l\'utilisateur');
    }
}