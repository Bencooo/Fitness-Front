import axios, { AxiosRequestHeaders } from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { IChallenge } from '../models/challenge.model';
import { APIService } from './api.service';

export class ChallengeService {
    static async createChallenge(challenge: IChallenge): Promise<ServiceResult<IChallenge>> {
        try {
            const token = localStorage.getItem('token');
            console.log('HELLO');
            console.log(challenge);  // Log pour vérifier les données envoyées
            const res = await axios.post(`${APIService.baseURL}/challenge`, challenge, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            console.log('HELLO2');
            if (res.status === 201) {
                return ServiceResult.success<IChallenge>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour créer un défi: ", err);
            return ServiceResult.failed();
        }
    }

    static async getAllChallenges(): Promise<ServiceResult<IChallenge[]>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${APIService.baseURL}/challenge`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<IChallenge[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les défis: ", err);
            return ServiceResult.failed();
        }
    }

    static async getChallengesBySalle(salleId: string): Promise<ServiceResult<IChallenge[]>> {
        try {
            const token = localStorage.getItem('token');
            console.log("SALLEID : ", salleId)
            const res = await axios.get(`${APIService.baseURL}/challenge/salle/${salleId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<IChallenge[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les défis: ", err);
            return ServiceResult.failed();
        }
    }

    static async updateChallenge(id: string, challenge: IChallenge): Promise<ServiceResult<IChallenge>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${APIService.baseURL}/challenge/${id}`, challenge, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<IChallenge>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour mettre à jour un défi: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteChallenge(id: string): Promise<ServiceResult<void>> {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${APIService.baseURL}/challenges/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 204) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer un défi: ", err);
            return ServiceResult.failed();
        }
    }
}
