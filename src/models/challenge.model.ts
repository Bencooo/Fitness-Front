export interface IChallenge {
    _id: string;
    name: string;
    description: string;
    equipment: string[];
    difficulty: string;
    type: string;
    salleId: string;
    creatorId: string;
    points: number;
}