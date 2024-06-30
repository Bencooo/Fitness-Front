import { IUser } from "./user.model";

export interface ISalle {
    id?: string;
    name: string;
    address: string;
    description: string;
    contact: string[];
    capacity: number;
    activities: string[];
    owner?: IUser;
    approved?: boolean;
}
