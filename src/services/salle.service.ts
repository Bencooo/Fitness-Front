import axios, { AxiosRequestHeaders } from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { ISalle } from '../models/salle.model';
import { APIService } from './api.service';

export class SalleService {
    static async getAllSalles(): Promise<ServiceResult<ISalle[]>> {
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

    static async createSalle(salle: ISalle): Promise<ServiceResult<ISalle>> {
        const token = localStorage.getItem('token');
        try {
            console.log("TOKEN :", token)
            const res = await axios.post(`${APIService.baseURL}/salle`, salle, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 201) {
                return ServiceResult.success<ISalle>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour créer une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async updateSalle(id: string, salle: ISalle): Promise<ServiceResult<ISalle>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${APIService.baseURL}/salle/edit/${id}`, salle, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<ISalle>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour mettre à jour une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteSalle(id: string): Promise<ServiceResult<void>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${APIService.baseURL}/salle/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 204) {
                return ServiceResult.success(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer une salle: ", err);
            return ServiceResult.failed();
        }
    }

    static async getSallesByOwner(ownerId: string): Promise<ServiceResult<ISalle[]>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${APIService.baseURL}/salle/owner/${ownerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<ISalle[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les salles par propriétaire: ", err);
            return ServiceResult.failed();
        }
    }
}
