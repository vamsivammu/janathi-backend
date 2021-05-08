import { IsNotEmpty, IsUUID } from "class-validator";

export class NewSectionDto{
    @IsNotEmpty()
    name:string;

    @IsUUID()
    quizId:string;
}