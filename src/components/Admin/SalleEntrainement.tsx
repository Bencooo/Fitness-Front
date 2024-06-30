import { ChangeEvent, useState, useEffect } from "react";
import { GymService } from "../../services/salle.service";
import { ISalle } from "../../models/salle.model";

function GymManagement() {
    const [gyms, setGyms] = useState<ISalle[]>([]);
    const [currentGym, setCurrentGym] = useState<Partial<ISalle>>({
        name: '',
        address: '',
        description: '',
        contact: [],
        capacity: 0,
        activities: []
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchGyms();
    }, []);

    useEffect(() => {
        filterGyms();
    }, [searchTerm, gyms]);

    const fetchGyms = async () => {
        const result = await GymService.getAllGyms();
        if (result.errorCode === 0 && result.result) {
            setGyms(result.result);
        } else {
            setErrorMessage("Failed to fetch gyms");
        }
    };

    const filterGyms = () => {
        const filtered = gyms.filter(gym =>
            gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gym.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gym.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            gym.contact.some(contact => contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
            gym.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setGyms(filtered);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentGym((old) => ({
            ...old,
            [name]: value,
        }));
    };

    const handleContactChange = (index: number, value: string) => {
        setCurrentGym((old) => {
            const contacts = old.contact ? [...old.contact] : [];
            contacts[index] = value;
            return {
                ...old,
                contact: contacts,
            };
        });
    };

    const handleAddContact = () => {
        setCurrentGym((old) => ({
            ...old,
            contact: old.contact ? [...old.contact, ''] : ['']
        }));
    };

    const handleRemoveContact = (index: number) => {
        setCurrentGym((old) => {
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
        if (isEdit && currentGym.id) {
            result = await GymService.editGym(currentGym.id, currentGym);
        } else {
            result = await GymService.createGym(currentGym as ISalle);
        }
        if (result.errorCode === 0) {
            fetchGyms();
            setCurrentGym({
                name: '',
                address: '',
                description: '',
                contact: [],
                capacity: 0,
                activities: []
            });
            setIsEdit(false);
        } else {
            setErrorMessage("Failed to save gym");
        }
    };

    const handleEdit = (gym: ISalle) => {
        setCurrentGym(gym);
        setIsEdit(true);
    };

    const handleDelete = async (id: string) => {
        const result = await GymService.deleteGym(id);
        if (result.errorCode === 0) {
            fetchGyms();
        } else {
            setErrorMessage("Failed to delete gym");
        }
    };

    const handleApprove = async (id: string) => {
        const result = await GymService.approveGym(id);
        if (result.errorCode === 0) {
            fetchGyms();
        } else {
            setErrorMessage("Failed to approve gym");
        }
    };

    return (
        <div>
            <h1>Gestion des Salles d'Entraînement</h1>
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
                    value={currentGym.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={currentGym.address}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={currentGym.description}
                    onChange={handleChange}
                    required
                />
                <div>
                    <h4>Contacts</h4>
                    {currentGym.contact?.map((c, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={c}
                                onChange={(e) => handleContactChange(index, e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveContact(index)}>Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddContact}>Ajouter un contact</button>
                </div>
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacité"
                    value={currentGym.capacity}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="activities"
                    placeholder="Activités (séparées par des virgules)"
                    value={currentGym.activities?.join(', ')}
                    onChange={(e) => setCurrentGym({ ...currentGym, activities: e.target.value.split(',').map(a => a.trim()) })}
                    required
                />
                <button type="submit">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Salles</h2>
            <ul>
                {gyms.map((gym) => (
                    <li key={gym.id}>
                        <h3>{gym.name}</h3>
                        <p>Adresse: {gym.address}</p>
                        <p>Description: {gym.description}</p>
                        <p>Contact: {gym.contact.join(', ')}</p>
                        <p>Capacité: {gym.capacity}</p>
                        <p>Activités: {gym.activities.join(', ')}</p>
                        <p>Status: {gym.approved ? 'Approuvé' : 'En attente'}</p>
                        <button onClick={() => handleEdit(gym)}>Modifier</button>
                        <button onClick={() => handleDelete(gym.id!)}>Supprimer</button>
                        {!gym.approved && <button onClick={() => handleApprove(gym.id!)}>Approuver</button>}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default GymManagement;
