import axios from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { IBadge } from '../models/badge.model';
import { APIService } from './api.service';

export class BadgeService {
    static async getAllBadges(): Promise<ServiceResult<IBadge[]>> {
        try {
            const res = await axios.get(`${APIService.baseURL}/badge`);
            if (res.status === 200) {
                return ServiceResult.success<IBadge[]>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour récupérer les badges: ", err);
            return ServiceResult.failed();
        }
    }

    static async createBadge(badge: IBadge): Promise<ServiceResult<IBadge>> {
        try {
            const res = await axios.post(`${APIService.baseURL}/badge`, badge);
            if (res.status === 201) {
                return ServiceResult.success<IBadge>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour créer un badge: ", err);
            return ServiceResult.failed();
        }
    }

    static async updateBadge(id: string, badge: IBadge): Promise<ServiceResult<IBadge>> {
        try {
            const res = await axios.put(`${APIService.baseURL}/badges/${id}`, badge);
            if (res.status === 200) {
                return ServiceResult.success<IBadge>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour mettre à jour un badge: ", err);
            return ServiceResult.failed();
        }
    }

    static async deleteBadge(id: string): Promise<ServiceResult<void>> {
        try {
            const res = await axios.delete(`${APIService.baseURL}/badge/${id}`);
            if (res.status === 204) {
                return ServiceResult.success<void>(undefined);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour supprimer un badge: ", err);
            return ServiceResult.failed();
        }
    }
}
