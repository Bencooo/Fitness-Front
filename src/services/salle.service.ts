import axios, { AxiosError } from 'axios';
import { ServiceResult } from './service.result';
import { ISalle } from '../models/salle.model';
import { APIService } from './api.service';

export class GymService {
    static async getAllGyms(): Promise<ServiceResult<ISalle[]>> {
        try {
            const res = await axios.get(`${APIService.baseURL}/salle`);
            if (res.status === 200) {
                return ServiceResult.success<ISalle[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les salles: ", err);
            return ServiceResult.failed();
        }
    }

    static async createGym(gym: ISalle): Promise<ServiceResult<ISalle>> {
        try {
            const res = await axios.post(`${APIService.baseURL}/gyms`, gym);
            if (res.status === 201) {
                return ServiceResult.success<ISalle>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour créer une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async editGym(id: string, gym: Partial<ISalle>): Promise<ServiceResult<void>> {
        try {
            const res = await axios.put(`${APIService.baseURL}/gyms/edit/${id}`, gym);
            if (res.status === 200) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour modifier une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteGym(id: string): Promise<ServiceResult<void>> {
        try {
            const res = await axios.delete(`${APIService.baseURL}/gyms/delete/${id}`);
            if (res.status === 200) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async approveGym(id: string): Promise<ServiceResult<void>> {
        try {
            const res = await axios.post(`${APIService.baseURL}/gyms/${id}/approve`);
            if (res.status === 200) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour approuver une salle: ", err);
            return ServiceResult.failed();
        }
    }
}
