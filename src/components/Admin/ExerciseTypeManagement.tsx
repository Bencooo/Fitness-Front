import { useState, useEffect, ChangeEvent } from "react";
import { ExerciseTypeService } from "../../services/exerciseType.service";
import { IExerciseType } from "../../models/exerciseType.model";
import { ServiceErrorCode } from "../../services/service.result";

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
        <div>
            <h1>Gestion des Types d'Exercices</h1>
            {errorMessage && <p className={"errorMessage"}>{errorMessage}</p>}
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
                    value={currentExerciseType.name}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={currentExerciseType.description}
                    onChange={handleChange}
                    required
                />
                <div>
                    <h4>Muscles Ciblés</h4>
                    {currentExerciseType.targetedMuscles?.map((muscle, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={muscle}
                                onChange={(e) => handleMuscleChange(index, e.target.value)}
                            />
                            <button type="button" onClick={() => handleRemoveMuscle(index)}>Supprimer</button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddMuscle}>Ajouter un muscle ciblé</button>
                </div>
                <button type="submit">{isEdit ? 'Modifier' : 'Créer'}</button>
            </form>
            <h2>Liste des Types d'Exercices</h2>
            <ul>
                {exerciseTypes.map((exerciseType) => (
                    <li key={exerciseType._id}>
                        <h3>{exerciseType.name}</h3>
                        <p>Description: {exerciseType.description}</p>
                        <p>Muscles Ciblés: {exerciseType.targetedMuscles.join(', ')}</p>
                        <button onClick={() => handleEdit(exerciseType)}>Modifier</button>
                        <button onClick={() => handleDelete(exerciseType._id!)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ExerciseTypeManagement;
