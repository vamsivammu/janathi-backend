import { IsNotEmpty } from "class-validator";

export class NewQuizDto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    description:string;

}