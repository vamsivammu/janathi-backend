export interface ICreateQuiz{
    name:string,
    description:string
}

export enum QUIZ_TYPE{
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    GRAND = 'GRAND',
    VIDEO = 'VIDEO'
}