import { GROUPS } from "src/chapters/models/chapters.interface";
import { Quiz } from "./quiz.entity";

export interface ICreateQuiz{
    name:string,
    description:string,
    category:GROUPS
}

export enum QUIZ_TYPE{
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    GRAND = 'GRAND',
    VIDEO = 'VIDEO'
}

export interface IQuiz extends Quiz{
    configuration:any;
}