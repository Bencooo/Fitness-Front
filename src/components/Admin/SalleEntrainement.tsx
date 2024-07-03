import { useState, useEffect, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { SalleService } from "../../services/salle.service";
import { ISalle } from "../../models/salle.model";
import { ServiceErrorCode } from "../../services/service.result";
import "./Admin.css";
function SalleManagement() {
    const { userId } = useParams<{ userId: string }>();
    const [salles, setSalles] = useState<ISalle[]>([]);
    const [currentSalle, setCurrentSalle] = useState<Partial<ISalle>>({
        name: '',
        address: '',
        description: '',
        contact: [''],
        capacity: 0,
        activities: [''],
        owner: userId,
        approved: false
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchSalles();
    }, []);

    /*const fetchSalles = async () => {
        const result = await SalleService.getAllSalles();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setSalles(result.result);
        } else {
            setErrorMessage("Failed to fetch salles");
        }
    };*/

    const fetchSalles = async () => {
        const result = await SalleService.getSallesByOwner(userId!);
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setSalles(result.result);
        } else {
            setErrorMessage("Failed to fetch salles");
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentSalle((old) => ({
            ...old,
            [name]: value,
        }));
    };

    const handleContactChange = (index: number, value: string) => {
        setCurrentSalle((old) => {
            const contacts = old.contact ? [...old.contact] : [];
            contacts[index] = value;
            return {
                ...old,
                contact: contacts,
            };
        });
    };

    const handleAddContact = () => {
        setCurrentSalle((old) => ({
            ...old,
            contact: old.contact ? [...old.contact, ''] : ['']
        }));
    };

    const handleRemoveContact = (index: number) => {
        setCurrentSalle((old) => {
            const contacts = old.contact ? [...old.contact] : [];
            contacts.splice(index, 1);
            return {
                ...old,
                contact: contacts,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (isEdit && currentSalle._id) {
            result = await SalleService.updateSalle(currentSalle._id, currentSalle as ISalle);
        } else {

            result = await SalleService.createSalle(currentSalle as ISalle);
        }
        if (result.errorCode === ServiceErrorCode.success) {
            fetchSalles();
            setCurrentSalle({
                name: '',
                address: '',
                description: '',
                contact: [''],
                capacity: 0,
                activities: [''],
                owner: '',
                approved: false
            });
            setIsEdit(false);
        } else {
            setErrorMessage("Failed to save salle");
        }
    };

    const handleEdit = (salle: ISalle) => {
        setCurrentSalle(salle);
        setIsEdit(true);
    };

    const handleDelete = async (id: string) => {
        const result = await SalleService.deleteSalle(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchSalles();
        } else {
            setErrorMessage("Failed to delete salle");
        }
    };

    return (
        <div id={"manage-salles-container"}>
            <h1>Gestion des Salles d'Entraînement</h1>
            {errorMessage && <p className={"errorMessage"}>{errorMessage}</p>}
            <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <form onSubmit={handleSubmit}>
                <label>Name :</label><br></br>
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={currentSalle.name}
                    onChange={handleChange}
                    required
                /><br></br>
                <label>Address :</label><br></br>
                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={currentSalle.address}
                    onChange={handleChange}
                    required
                /><br></br>
                <label>Description :</label><br></br>
                <textarea
                    name="description"
                    placeholder="Description"
                    value={currentSalle.description}
                    onChange={handleChange}
                    required
                /><br></br>
                <div>
                    <label>Contacts</label><br></br>
                    {currentSalle.contact?.map((contact, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => handleContactChange(index, e.target.value)}
                            /><br></br>
                            <button type="button" onClick={() => handleRemoveContact(index)}>Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddContact}>Ajouter un contact</button>
                </div>
                <label>Capacity :</label><br></br>
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacité"
                    value={currentSalle.capacity}
                    onChange={handleChange}
                    required
                /><br></br>
                <label>Activities :</label><br></br>
                <textarea
                    name="activities"
                    placeholder="Activités"
                    value={currentSalle.activities}
                    onChange={handleChange}
                    required
                /><br></br>
                <button type="submit">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Salles d'Entraînement</h2>
            <ul>
                {salles.map((salle) => (
                    <li key={salle._id}>
                        <h3>{salle.name}</h3>
                        <p>Adresse: {salle.address}</p>
                        <p>Description: {salle.description}</p>
                        <p>Contacts: {salle.contact.join(', ')}</p>
                        <p>Capacité: {salle.capacity}</p>
                        <p>Activités: {salle.activities.join(', ')}</p>
                        <button onClick={() => handleEdit(salle)}>Modifier</button>
                        <button onClick={() => handleDelete(salle._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SalleManagement;
