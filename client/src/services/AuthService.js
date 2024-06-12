import { useState, useEffect } from 'react';
import { getUser } from './UserService';



// Fonction pour créer un nouvel utilisateur
export async function createUser(login, password, repeatpassword, lastname, firstname) {

    const response = await fetch("http://localhost:4000/api/user/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login,
            password,
            repeatpassword,
            lastname,
            firstname
        })
    });
    
    if (response.ok) {
        return response.json();
    } else {
        console.log(response)
        throw new Error('Erreur lors de la création de l\'utilisateur');
    }
}

// Fonction pour connecter un utilisateur
export async function login(login, password) {
    const response = await fetch("http://localhost:4000/api/user/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            login,
            password
        })
    });
    
    if (response.ok) {
        // return response.json();

        const res = await response.json();
        
        const user = await getUser(res.userID);

        if (!user.admin && !user.confirmed) {
            throw new Error("L'utilisateur n'est pas encore confirmé");
        }

        return user;

    } else {
        console.log(response)
        throw new Error('Erreur lors de la connexion');
    }
}


export const useUserInfo = (userId) => {
    // États pour stocker les prénoms et noms de l'utilisateur
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                // Faire une requête GET pour récupérer les données de l'utilisateur
                const response = await fetch(`http://localhost:4000/api/user/${userId}`);
                // Vérifier que la réponse est correcte
                if (response.ok) {
                    const user = await response.json();
                    // Mettre à jour les états avec les prénoms et noms de l'utilisateur
                    setFirstname(user.firstname);
                    setLastname(user.lastname);
                } else {
                    console.error('Erreur lors de la récupération des informations utilisateur:', response.status);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations utilisateur:', error);
            }
        };

        // Appeler la fonction pour récupérer les informations utilisateur
        fetchUserInfo();
    }, [userId]);

    // Retourne les prénoms et noms de l'utilisateur
    return { firstname, lastname };
};


