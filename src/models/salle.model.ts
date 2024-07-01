import { IUser } from "./user.model";

export interface ISalle {
    _id: string;
    name: string;
    address: string;
    description: string;
    contact: string[];
    capacity: number;
    activities: string[];
    owner?: string;
    approved?: boolean;
}

