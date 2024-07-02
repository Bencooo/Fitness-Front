import { useState, useEffect, ChangeEvent } from "react";
import { ChallengeService } from "../../services/challenge.service";
import { IChallenge } from "../../models/challenge.model";
import { ServiceErrorCode } from "../../services/service.result";

const token = 'votre_token_ici'; // Remplacez ceci par la méthode appropriée pour obtenir le token de l'utilisateur
const salleId = 'id_de_la_salle'; // Remplacez ceci par l'ID de la salle à laquelle les défis sont associés

function ChallengeManagement() {
    const [challenges, setChallenges] = useState<IChallenge[]>([]);
    const [currentChallenge, setCurrentChallenge] = useState<Partial<IChallenge>>({
        name: '',
        description: '',
        equipment: [],
        difficulty: '',
        type: '',
        salleId: salleId,
        creatorId: '', // Remplacez ceci par l'ID du créateur si nécessaire
        points: 0
    });
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchChallenges();
    }, []);

    const fetchChallenges = async () => {
        const result = await ChallengeService.getChallengesBySalle(salleId, token);
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
            result = await ChallengeService.updateChallenge(currentChallenge._id, currentChallenge as IChallenge, token);
        } else {
            result = await ChallengeService.createChallenge(currentChallenge as IChallenge, token);
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
                points: 0
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
        const result = await ChallengeService.deleteChallenge(id, token);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchChallenges();
        } else {
            setErrorMessage("Failed to delete challenge");
        }
    };

    return (
        <div>
            <h1>Proposition de Défis Spécifiques</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={currentChallenge.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={currentChallenge.description}
                    onChange={handleChange}
                    required
                />
                <div>
                    <h4>Équipements</h4>
                    {currentChallenge.equipment?.map((equip, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={equip}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'equipment')}
                            />
                            <button type="button" onClick={() => handleRemoveArrayItem(index, 'equipment')}>Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddArrayItem('equipment')}>Ajouter un équipement</button>
                </div>
                <input
                    type="text"
                    name="difficulty"
                    placeholder="Difficulté"
                    value={currentChallenge.difficulty}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={currentChallenge.type}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="points"
                    placeholder="Points"
                    value={currentChallenge.points}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Défis</h2>
            <ul>
                {challenges.map((challenge) => (
                    <li key={challenge._id}>
                        <h3>{challenge.name}</h3>
                        <p>Description: {challenge.description}</p>
                        <p>Équipements: {challenge.equipment.join(', ')}</p>
                        <p>Difficulté: {challenge.difficulty}</p>
                        <p>Type: {challenge.type}</p>
                        <p>Points: {challenge.points}</p>
                        <button onClick={() => handleEdit(challenge)}>Modifier</button>
                        <button onClick={() => handleDelete(challenge._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ChallengeManagement;