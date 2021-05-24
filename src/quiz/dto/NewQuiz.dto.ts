import { IsNotEmpty } from "class-validator";
import { GROUPS } from "src/chapters/models/chapters.interface";

export class NewQuizDto{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    description:string;

    @IsNotEmpty()
    category:GROUPS;

}