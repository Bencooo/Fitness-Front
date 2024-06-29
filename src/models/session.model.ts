import {IUserId} from "./user.model";

export interface ISession {
    user: IUserId;
    expirationDate: Date;
    token: string;
}

export type ISessionId = ISession & { _id: string };