import { useState, useEffect, ChangeEvent } from "react";
import { BadgeService } from "../../services/badge.service";
import { IBadge } from "../../models/badge.model";
import { ServiceErrorCode } from "../../services/service.result";

function BadgeManagement() {
    const [badges, setBadges] = useState<IBadge[]>([]);
    const [currentBadge, setCurrentBadge] = useState<Partial<IBadge>>({
        name: '',
        description: '',
        criteria: '',
        imageUrl: ''
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        const result = await BadgeService.getAllBadges();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setBadges(result.result);
        } else {
            setErrorMessage("Failed to fetch badges");
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentBadge((old) => ({
            ...old,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (isEdit && currentBadge._id) {
            result = await BadgeService.updateBadge(currentBadge._id, currentBadge as IBadge);
        } else {
            result = await BadgeService.createBadge(currentBadge as IBadge);
        }
        if (result.errorCode === ServiceErrorCode.success) {
            fetchBadges();
            setCurrentBadge({
                name: '',
                description: '',
                criteria: '',
                imageUrl: ''
            });
            setIsEdit(false);
        } else {
            setErrorMessage("Failed to save badge");
        }
    };

    const handleEdit = (badge: IBadge) => {
        setCurrentBadge(badge);
        setIsEdit(true);
    };

    const handleDelete = async (id: string) => {
        const result = await BadgeService.deleteBadge(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchBadges();
        } else {
            setErrorMessage("Failed to delete badge");
        }
    };

    return (
        <div>
            <h1>Gestion des Badges et Récompenses</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={currentBadge.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={currentBadge.description}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="criteria"
                    placeholder="Critères"
                    value={currentBadge.criteria}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="URL de l'image"
                    value={currentBadge.imageUrl}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Badges</h2>
            <ul>
                {badges.map((badge) => (
                    <li key={badge._id}>
                        <h3>{badge.name}</h3>
                        <p>Description: {badge.description}</p>
                        <p>Critères: {badge.criteria}</p>
                        <img src={badge.imageUrl} alt={badge.name} width="100" />
                        <button onClick={() => handleEdit(badge)}>Modifier</button>
                        <button onClick={() => handleDelete(badge._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BadgeManagement;
