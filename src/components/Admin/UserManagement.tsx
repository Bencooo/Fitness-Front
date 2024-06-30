import { useState, useEffect } from "react";
import { UserService } from "../../services/user.service";
import { IUser } from "../../models/user.model";
import { ServiceErrorCode } from "../../services/service.result";

function UserManagement() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await UserService.getAllUsers();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setUsers(result.result);
        } else {
            setErrorMessage("Failed to fetch users");
        }
    };

    const handleDeactivate = async (id: string) => {
        const result = await UserService.deactivateUser(id);
        console.log(id)
        if (result.errorCode === ServiceErrorCode.success) {
            fetchUsers();
        } else {
            setErrorMessage("Failed to deactivate user");
        }
    };

    const handleDelete = async (id: string) => {
        const result = await UserService.deleteUser(id);
        console.log(id)
        if (result.errorCode === ServiceErrorCode.success) {
            fetchUsers();
        } else {
            setErrorMessage("Failed to delete user");
        }
    };

    return (
        <div>
            <h1>Gestion des Utilisateurs</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <h3>{user.login}</h3>
                        <p>Status: {user.active ? 'Active' : 'Inactive'}</p>
                        <button onClick={() => handleDeactivate(user._id!)}>Désactiver</button>
                        <button onClick={() => handleDelete(user._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserManagement;
