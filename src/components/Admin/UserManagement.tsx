import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserService } from "../../services/user.service";
import { SalleService } from "../../services/salle.service";
import { IUser } from "../../models/user.model";
import { ISalle } from "../../models/salle.model";
import { ServiceErrorCode } from "../../services/service.result";
import "./Admin.css";

const token = 'votre_token_ici'; // Remplacez ceci par la méthode appropriée pour obtenir le token de l'utilisateur

function UserManagement() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [salles, setSalles] = useState<{ [key: string]: ISalle[] }>({});
    const [errorMessage, setErrorMessage] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await UserService.getAllUsers();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setUsers(result.result);
            result.result.forEach(async (user: IUser) => {
                const salleResult = await SalleService.getSallesByOwner(user._id!);
                if (salleResult.errorCode === ServiceErrorCode.success && salleResult.result && salleResult.result.length > 0) {
                    setSalles((prevSalles) => ({ ...prevSalles, [user._id!]: salleResult.result || [] }));
                } else {
                    setSalles((prevSalles) => ({ ...prevSalles, [user._id!]: [] }));
                }
            });
        } else {
            setErrorMessage("Failed to fetch users");
        }
    };

    const handleDeactivate = async (id: string) => {
        const result = await UserService.deactivateUser(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchUsers();
        } else {
            setErrorMessage("Failed to deactivate user");
        }
    };

    const handleDelete = async (id: string) => {
        const result = await UserService.deleteUser(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchUsers();
        } else {
            setErrorMessage("Failed to delete user");
        }
    };

    const handleViewMore = (userId: string) => {
        navigate(`/salle/${userId}`);
    };

    return (
        <div id={"manage-users-container"}>
            <h1>Gestion des Utilisateurs</h1>
            {errorMessage && <p className={"errorMessage"}>{errorMessage}</p>}
            <ul>
                {users.map((user: IUser) => (
                    <li  className={"user"} key={user._id}>
                        <h3>{user.login}</h3>
                        <p>Status: {user.active ? 'Active' : 'Inactive'}</p>
                        <p>
                            Salles: {salles[user._id!] && salles[user._id!].length > 0
                                ? salles[user._id!].map((salle) => salle.name).join(', ')
                                : 'Aucune salle'}
                        </p>
                        <button onClick={() => handleDeactivate(user._id!)}>Désactiver</button>
                        <button onClick={() => handleViewMore(user._id!)}>Voir Plus</button>
                        <button onClick={() => handleDelete(user._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserManagement;
