import React, { useState, useEffect } from 'react';
import { getUsers, updateUserRole, validateUser, deleteUser } from '../services/AdminService';
import Header from './Header';
import './CSS/AdminComponent.css';


const AdminComponent = ({handleLogout}) => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    useEffect(() => {
        const savedUserData = JSON.parse(sessionStorage.getItem('userData'));
    
        if (savedUserData) {
            setIsAdmin(savedUserData.admin);
            setUserId(savedUserData.id);
        }
    }, []);

    useEffect(() => {
        // Fonction pour récupérer la liste des utilisateurs
        const fetchUsers = async () => {
            try {
                if (userId) {
                    const userList = await getUsers(userId);
                    const newList = userList.message.filter(user => user.id !== userId);
                    setUsers(newList);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs :', error);
            }
        };
    
        if (userId !== null) {
            fetchUsers();
        }
    }, [userId]);

    // Gestion du changement de rôle d'un utilisateur
    const handleRoleChange = async (userId, userId2, role) => {
        try {
            await updateUserRole(userId, userId2, role);

            const userList = await getUsers(userId);

            const newList = userList.message.filter(user => user.id !== userId);

            setUsers(newList);
        } catch (error) {
            console.error('Erreur lors de la mise à jour du rôle :', error);
        }
    };

    // Gestion de la validation de l'inscription d'un utilisateur
    const handleValidation = async (userId, userId2) => {
        try {
            await validateUser(userId, userId2);

            const userList = await getUsers(userId);
            
            const newList = userList.message.filter(user => user.id !== userId);

            setUsers(newList);
        } catch (error) {
            console.error('Erreur lors de la validation de l\'inscription :', error);
        }
    };

    const handleDelete = async (userId, userId2) => {
        try {
            await deleteUser(userId, userId2);

            const userList = await getUsers(userId);
            
            const newList = userList.message.filter(user => user.id !== userId);

            setUsers(newList);
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'inscription :', error);
        }
    };

    return (
        <div className="admin-component">
            <Header isConnected={true} handleLogout={handleLogout} isAdmin={isAdmin} />

            {/* Affiche la liste des utilisateurs */}
            <div className="user-list">

                {users?.map((user) => (
                    
                    <div key={user._id} className="user-item">
                        <div>
                            <p>{user.firstname}, {user.lastname}   {user.admin && <strong>ADMIN</strong>}   </p>
                        </div>
                        <div>

                            <button className="role-change" onClick={() => handleRoleChange(userId, user.id, user.admin ? 'membre' : 'admin')}>
                                {user.admin ? 'Retirer le rôle d\'admin' : 'Donner le rôle d\'admin'}
                            </button>


                            {!user.confirmed && (
                                <button className="validate" onClick={() => handleValidation(userId, user.id)}>Valider l'inscription</button>
                            )}

                            <button className="delete" onClick={() => handleDelete(userId, user.id)}>Supprimer</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminComponent;
