import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SalleService } from "../../services/salle.service";
import { ISalle } from "../../models/salle.model";
import { ServiceErrorCode } from "../../services/service.result";
import "./SalleList.css";

const token = localStorage.getItem('token') || ''; // Assurez-vous que le token est correctement récupéré

function SalleList() {
    const [salles, setSalles] = useState<ISalle[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
        fetchSalles();
    }, []);

    const fetchSalles = async () => {
        if (!token) {
            setErrorMessage("Token is undefined");
            return;
        }
        const result = await SalleService.getAllSalles();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setSalles(result.result);
        } else {
            setErrorMessage("Failed to fetch salles");
        }
    };

    const handleShowChallenge = (salleId: string) => {
        navigate(`/challenges/${salleId}`);
    };

    return (
        <div className="container">
            <h1>Liste des Salles d'Entraînement</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <ul className="salle-list">
                {salles.map((salle) => (
                    <li className="salle-item" key={salle._id}>
                        <h3 className="salle-name">{salle.name}</h3>
                        <p className="salle-address">Adresse: {salle.address}</p>
                        <p className="salle-description">Description: {salle.description}</p>
                        <p className="salle-contact">Contacts: {salle.contact.join(', ')}</p>
                        <p className="salle-capacity">Capacité: {salle.capacity}</p>
                        <p className="salle-activities">Activités: {salle.activities.join(', ')}</p>
                        <button className="show-challenge-button" onClick={() => handleShowChallenge(salle._id)}>Voir
                            Challenge
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default SalleList;
