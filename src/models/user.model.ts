export interface IUser {
    login: string;
    accesses: string[];
}

export type IUserId = IUser & { _id: string };