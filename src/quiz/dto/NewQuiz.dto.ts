import { IsNotEmpty } from "class-validator";
import { GROUPS } from "src/chapters/models/chapters.interface";
import { QUIZ_TYPE } from "../models/quiz.interface";

export class NewQuizDto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    category:GROUPS;

    @IsNotEmpty()
    type:QUIZ_TYPE;
}