import { useState, useEffect, ChangeEvent } from "react";
import { ExerciseTypeService } from "../../services/exerciseType.service";
import { IExerciseType } from "../../models/exerciseType.model";
import { ServiceErrorCode } from "../../services/service.result";
import './ExerciseTypeManagement.css';

function ExerciseTypeManagement() {
    const [exerciseTypes, setExerciseTypes] = useState<IExerciseType[]>([]);
    const [currentExerciseType, setCurrentExerciseType] = useState<Partial<IExerciseType>>({
        name: '',
        description: '',
        targetedMuscles: []
    });
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>();
    const [isEdit, setIsEdit] = useState<boolean>(false);

    useEffect(() => {
        fetchExerciseTypes();
    }, []);

    const fetchExerciseTypes = async () => {
        const result = await ExerciseTypeService.getAllExerciseTypes();
        if (result.errorCode === ServiceErrorCode.success && result.result) {
            setExerciseTypes(result.result);
        } else {
            setErrorMessage("Failed to fetch exercise types");
        }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setCurrentExerciseType((old) => ({
            ...old,
            [name]: value,
        }));
    };

    const handleMuscleChange = (index: number, value: string) => {
        setCurrentExerciseType((old) => {
            const muscles = old.targetedMuscles ? [...old.targetedMuscles] : [];
            muscles[index] = value;
            return {
                ...old,
                targetedMuscles: muscles,
            };
        });
    };

    const handleAddMuscle = () => {
        setCurrentExerciseType((old) => ({
            ...old,
            targetedMuscles: old.targetedMuscles ? [...old.targetedMuscles, ''] : ['']
        }));
    };

    const handleRemoveMuscle = (index: number) => {
        setCurrentExerciseType((old) => {
            const muscles = old.targetedMuscles ? [...old.targetedMuscles] : [];
            muscles.splice(index, 1);
            return {
                ...old,
                targetedMuscles: muscles,
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let result;
        if (isEdit && currentExerciseType._id) {
            result = await ExerciseTypeService.updateExerciseType(currentExerciseType._id, currentExerciseType as IExerciseType);
        } else {
            result = await ExerciseTypeService.createExerciseType(currentExerciseType as IExerciseType);
        }
        if (result.errorCode === ServiceErrorCode.success) {
            fetchExerciseTypes();
            setCurrentExerciseType({
                name: '',
                description: '',
                targetedMuscles: []
            });
            setIsEdit(false);
        } else {
            setErrorMessage("Failed to save exercise type");
        }
    };

    const handleEdit = (exerciseType: IExerciseType) => {
        setCurrentExerciseType(exerciseType);
        setIsEdit(true);
    };

    const handleDelete = async (id: string) => {
        console.log("ID: ", id)
        const result = await ExerciseTypeService.deleteExerciseType(id);
        if (result.errorCode === ServiceErrorCode.success) {
            fetchExerciseTypes();
        } else {
            setErrorMessage("Failed to delete exercise type");
        }
    };

    return (
        <div className="container">
            <h1>Gestion des Types d'Exercices</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
                type="text"
                className="search-input"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <form className="exercise-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    className="input-field"
                    placeholder="Nom"
                    value={currentExerciseType.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    className="textarea-field"
                    placeholder="Description"
                    value={currentExerciseType.description}
                    onChange={handleChange}
                    required
                />
                <div className="muscles-section">
                    <h4>Muscles Ciblés</h4>
                    {currentExerciseType.targetedMuscles?.map((muscle, index) => (
                        <div key={index} className="muscle-item">
                            <input
                                type="text"
                                className="input-field"
                                value={muscle}
                                onChange={(e) => handleMuscleChange(index, e.target.value)}
                            />
                            <button type="button" className="remove-button"
                                    onClick={() => handleRemoveMuscle(index)}>Supprimer
                            </button>
                        </div>
                    ))}
                    <button type="button" className="add-button" onClick={handleAddMuscle}>Ajouter un muscle ciblé
                    </button>
                </div>
                <button type="submit" className="submit-button">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Types d'Exercices</h2>
            <ul className="exercise-list">
                {exerciseTypes.map((exerciseType) => (
                    <li className="exercise-item" key={exerciseType._id}>
                        <h3 className="exercise-name">{exerciseType.name}</h3>
                        <p className="exercise-description">Description: {exerciseType.description}</p>
                        <p className="exercise-muscles">Muscles Ciblés: {exerciseType.targetedMuscles.join(', ')}</p>
                        <button className="edit-button" onClick={() => handleEdit(exerciseType)}>Modifier</button>
                        <button className="delete-button" onClick={() => handleDelete(exerciseType._id)}>Supprimer
                        </button>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default ExerciseTypeManagement;
