import axios, { AxiosError, AxiosRequestHeaders } from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { IUser } from '../models/user.model';
import { APIService } from './api.service';

export class UserService {
    static async getAllUsers(): Promise<ServiceResult<IUser[]>> {
        try {
            const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
            const res = await axios.get(`${APIService.baseURL}/user`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<IUser[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les utilisateurs: ", err);
            return ServiceResult.failed();
        }
    }

    static async deactivateUser(id: string): Promise<ServiceResult<void>> {
        try {
            const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
            const res = await axios.put(`${APIService.baseURL}/user/deactivate/${id}`);
            if (res.status === 200) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour désactiver un utilisateur: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteUser(id: string): Promise<ServiceResult<void>> {
        try {
            const token = localStorage.getItem('token'); // Récupérer le token depuis le localStorage
            const res = await axios.delete(`${APIService.baseURL}/user/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 200) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer un utilisateur: ", err);
            return ServiceResult.failed();
        }
    }
}
