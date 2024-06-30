export interface IUser {
    _id: string
    login: string;
    accesses: number;
    active: boolean;
}

export type IUserId = IUser & { _id: string };
