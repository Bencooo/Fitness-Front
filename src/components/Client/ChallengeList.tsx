import { useState, useEffect, ChangeEvent } from "react";
import { ChallengeService } from "../../services/challenge.service";
import { UserChallengeService } from "../../services/userChallenge.service";
import { IChallenge } from "../../models/challenge.model";
import { ServiceErrorCode } from "../../services/service.result";

const token = localStorage.getItem('token') || ''; // Assurez-vous que le token est correctement récupéré
const userId = localStorage.getItem('userId') || ''; // Assurez-vous que l'ID de l'utilisateur est correctement récupéré

function ChallengeList() {
    const [challenges, setChallenges] = useState<IChallenge[]>([]);
    const [filteredChallenges, setFilteredChallenges] = useState<IChallenge[]>([]);
    const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
    const [filter, setFilter] = useState({
        difficulty: '',
        type: '',
        duration: ''
    });
    const [errorMessage, setErrorMessage] = useState<string>();

    useEffect(() => {
        fetchChallenges();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filter, challenges]);

    const fetchChallenges = async () => {
        if (!token) {
            setErrorMessage("Token is undefined");
            return;
        }
        const result = await ChallengeService.getAllChallenges();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setChallenges(result.result);
        } else {
            setErrorMessage("Failed to fetch challenges");
        }
    };

    const applyFilters = () => {
        setFilteredChallenges(
            challenges.filter(challenge => 
                (filter.difficulty ? challenge.difficulty === filter.difficulty : true) &&
                (filter.type ? challenge.type === filter.type : true)
            )
        );
    };

    const handleFilterChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilter(prevFilter => ({ ...prevFilter, [name]: value }));
    };

    const handleCheckboxChange = (challengeId: string) => {
        setSelectedChallenges(prevSelected =>
            prevSelected.includes(challengeId)
                ? prevSelected.filter(id => id !== challengeId)
                : [...prevSelected, challengeId]
        );
    };

    const handleValidateChallenges = async () => {
        if (!token) {
            setErrorMessage("User ID or Token is missing");
            return;
        }
        for (const challengeId of selectedChallenges) {
            console.log(challengeId)
            await UserChallengeService.startChallenge(challengeId, token);
        }
        setSelectedChallenges([]);
    };

    return (
        <div>
            <h1>Exploration des Défis</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            
            <div>
                <label>
                    Difficulté:
                    <select name="difficulty" value={filter.difficulty} onChange={handleFilterChange}>
                        <option value="">Toutes</option>
                        <option value="Easy">Facile</option>
                        <option value="Medium">Moyenne</option>
                        <option value="Hard">Difficile</option>
                    </select>
                </label>
                <label>
                    Type:
                    <input type="text" name="type" value={filter.type} onChange={handleFilterChange} placeholder="Type d'exercice"/>
                </label>
                <label>
                    Durée:
                    <input type="number" name="duration" value={filter.duration} onChange={handleFilterChange} placeholder="Durée (en minutes)"/>
                </label>
            </div>

            <h2>Liste des Défis</h2>
            <ul>
                {filteredChallenges.map((challenge) => (
                    <li key={challenge._id}>
                        <h3>{challenge.name}</h3>
                        <p>Description: {challenge.description}</p>
                        <p>Équipements: {challenge.equipment.join(', ')}</p>
                        <p>Difficulté: {challenge.difficulty}</p>
                        <p>Type: {challenge.type}</p>
                        <label>
                            Terminé
                            <input
                                type="checkbox"
                                checked={selectedChallenges.includes(challenge._id!)}
                                onChange={() => handleCheckboxChange(challenge._id!)}
                            />
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={handleValidateChallenges}>Valider les défis sélectionnés</button>
        </div>
    );
}

export default ChallengeList;
