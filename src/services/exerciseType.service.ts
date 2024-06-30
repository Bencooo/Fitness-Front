import axios from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { IExerciseType } from '../models/exerciseType.model';
import { APIService } from './api.service';

export class ExerciseTypeService {
    static async getAllExerciseTypes(): Promise<ServiceResult<IExerciseType[]>> {
        try {
            const res = await axios.get(`${APIService.baseURL}/exerciseType`);
            if (res.status === 200) {
                return ServiceResult.success<IExerciseType[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les types d'exercice: ", err);
            return ServiceResult.failed();
        }
    }

    static async createExerciseType(exerciseType: IExerciseType): Promise<ServiceResult<IExerciseType>> {
        try {
            const res = await axios.post(`${APIService.baseURL}/exerciseType`, exerciseType);
            if (res.status === 201) {
                return ServiceResult.success<IExerciseType>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour créer un type d'exercice: ", err);
            return ServiceResult.failed();
        }
    }

    static async updateExerciseType(id: string, exerciseType: IExerciseType): Promise<ServiceResult<IExerciseType>> {
        try {
            const res = await axios.put(`${APIService.baseURL}/exerciseType/${id}`, exerciseType);
            if (res.status === 200) {
                return ServiceResult.success<IExerciseType>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour mettre à jour un type d'exercice: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteExerciseType(id: string): Promise<ServiceResult<void>> {
        try {
            const res = await axios.delete(`${APIService.baseURL}/exerciseType/${id}`);
            if (res.status === 204) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer un type d'exercice: ", err);
            return ServiceResult.failed();
        }
    }
}

