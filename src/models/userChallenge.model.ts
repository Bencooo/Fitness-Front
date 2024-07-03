export interface IUserChallenge {
    userId: String; 
    challengeId: String; 
    status: string; 
    progress: number; 
    dateStarted: Date;
    dateCompleted?: Date; 
}