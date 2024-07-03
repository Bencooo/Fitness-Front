import { useState, useEffect } from "react";
import { SalleService } from "../../services/salle.service";
import { ISalle } from "../../models/salle.model";
import { ServiceErrorCode } from "../../services/service.result";

const token = localStorage.getItem('token') || ''; // Assurez-vous que le token est correctement récupéré

function SalleList() {
    const [salles, setSalles] = useState<ISalle[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>();

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

    return (
        <div>
            <h1>Liste des Salles d'Entraînement</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <ul>
                {salles.map((salle) => (
                    <li key={salle._id}>
                        <h3>{salle.name}</h3>
                        <p>Adresse: {salle.address}</p>
                        <p>Description: {salle.description}</p>
                        <p>Contacts: {salle.contact.join(', ')}</p>
                        <p>Capacité: {salle.capacity}</p>
                        <p>Activités: {salle.activities.join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SalleList;
