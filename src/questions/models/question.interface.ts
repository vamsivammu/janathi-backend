import { Choice } from "src/choices/models/choice.entity";
import { Quiz } from "src/quiz/models/quiz.entity";

export enum QuestionType{
    SUBJECTIVE = 'SUBJECTIVE',
    MULTIPLE_CHOICE = 'MULTIPLE_CHOICE'
}

export interface IQuestion{
    id?:string,
    questionContent:string,
    images?:string[],
    choices:string[],
    answer:string
}