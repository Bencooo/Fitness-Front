import axios, { AxiosRequestHeaders } from 'axios';
import { ServiceResult, ServiceErrorCode } from './service.result';
import { IUserChallenge } from '../models/userChallenge.model';
import { APIService } from './api.service';

export class UserChallengeService {
    static async startChallenge(challengeId: string, token: string): Promise<ServiceResult<IUserChallenge>> {
        const userId = localStorage.getItem('user');
        try {
            console.log('challengeId :', challengeId)
            const res = await axios.post(`${APIService.baseURL}/userChallenge`, { userId, challengeId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                } as AxiosRequestHeaders
            });
            if (res.status === 201) {
                return ServiceResult.success<IUserChallenge>(res.data);
            }
            return ServiceResult.failed();
        } catch (err) {
            console.error("Erreur lors de l'appel à l'API pour démarrer un défi: ", err);
            return ServiceResult.failed();
        }
    }
}
