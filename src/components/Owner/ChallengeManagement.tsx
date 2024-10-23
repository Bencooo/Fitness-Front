import { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { ChallengeService } from "../../services/challenge.service";
import { IChallenge } from "../../models/challenge.model";
import { ServiceErrorCode } from "../../services/service.result";
import "./ChallengeManagement.css";

function ChallengeManagement() {
    const { salleId } = useParams<{ salleId: string | undefined }>();
    const [challenges, setChallenges] = useState<IChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] = useState<Partial<IChallenge>>({
        name: '',
        description: '',
        equipment: [],
        difficulty: '',
        type: '',
        salleId: salleId,
        creatorId: 'kbjlknml', // Remplacez ceci par l'ID du créateur si nécessaire
    });
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        if (!salleId) {
            setErrorMessage("Salle ID is undefined");
            return;
        }

        const result = await ChallengeService.getChallengesBySalle(salleId);
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setChallenges(result.result);
        } else {
            setErrorMessage("Failed to fetch challenges");
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentChallenge((old) => ({
            ...old,
            [name]: value,
        }));
    };

    const handleArrayChange = (index: number, value: string, arrayName: keyof IChallenge) => {
        setCurrentChallenge((old) => {
            const array = old[arrayName] ? [...old[arrayName] as string[]] : [];
            array[index] = value;
            return {
                ...old,
                [arrayName]: array,
            };
        });
    };

    const handleAddArrayItem = (arrayName: keyof IChallenge) => {
        setCurrentChallenge((old) => ({
            ...old,
            [arrayName]: old[arrayName] ? [...old[arrayName] as string[], ''] : ['']
        }));
    };

    const handleRemoveArrayItem = (index: number, arrayName: keyof IChallenge) => {
        setCurrentChallenge((old) => {
            const array = old[arrayName] ? [...old[arrayName] as string[]] : [];
            array.splice(index, 1);
            return {
                ...old,
                [arrayName]: array,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (isEdit && currentChallenge._id) {
            result = await ChallengeService.updateChallenge(currentChallenge._id, currentChallenge as IChallenge);
        } else {
            result = await ChallengeService.createChallenge(currentChallenge as IChallenge);
        }
        if (result.errorCode === ServiceErrorCode.success) {
            fetchChallenges();
            setCurrentChallenge({
                name: '',
                description: '',
                equipment: [],
                difficulty: '',
                type: '',
                salleId: salleId,
                creatorId: '', // Remplacez ceci par l'ID du créateur si nécessaire
            });
            setIsEdit(false);
        } else {
            setErrorMessage("Failed to save challenge");
        }
    };

    const handleEdit = (challenge: IChallenge) => {
        setCurrentChallenge(challenge);
        setIsEdit(true);
    };

    const handleDelete = async (id: string) => {
        const result = await ChallengeService.deleteChallenge(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchChallenges();
        } else {
            setErrorMessage("Failed to delete challenge");
        }
    };

    return (
        <div className="container">
            <h1>Proposition de Défis Spécifiques</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form className="challenge-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Nom"
                    value={currentChallenge.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    className="textarea-field"
                    placeholder="Description"
                    value={currentChallenge.description}
                    onChange={handleChange}
                    required
                />
                <div className="equipment-section">
                    <h4>Équipements</h4>
                    {currentChallenge.equipment?.map((equip, index) => (
                        <div key={index} className="equipment-item">
                            <input
                                type="text"
                                className="input-field"
                                value={equip}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'equipment')}
                            />
                            <button type="button" className="remove-button"
                                    onClick={() => handleRemoveArrayItem(index, 'equipment')}>Supprimer
                            </button>
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={() => handleAddArrayItem('equipment')}>Ajouter
                        un équipement
                    </button>
                </div>
                <input
                    type="text"
                    name="difficulty"
                    className="input-field"
                    placeholder="Difficulté"
                    value={currentChallenge.difficulty}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="type"
                    className="input-field"
                    placeholder="Type"
                    value={currentChallenge.type}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="submit-button">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Défis</h2>
            <ul className="challenge-list">
                {challenges.map((challenge) => (
                    <li className="challenge-item" key={challenge._id}>
                        <h3 className="challenge-name">{challenge.name}</h3>
                        <p className="challenge-description">Description: {challenge.description}</p>
                        <p className="challenge-equipment">Équipements: {challenge.equipment.join(', ')}</p>
                        <p className="challenge-difficulty">Difficulté: {challenge.difficulty}</p>
                        <p className="challenge-type">Type: {challenge.type}</p>
                        <button className="edit-button" onClick={() => handleEdit(challenge)}>Modifier</button>
                        <button className="delete-button" onClick={() => handleDelete(challenge._id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default ChallengeManagement;
