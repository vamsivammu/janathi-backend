import { IsNotEmpty, IsOptional } from "class-validator";
import { PAPER } from "src/papers/dto/paper.enum";

export class NewQuestionDto{
    @IsNotEmpty()
    questionContent:string;
    
    @IsOptional()
    choices:any[];

    @IsOptional()
    optionImages:string;

    @IsOptional()
    questionImages:string;

    @IsNotEmpty()
    answer:string;
    
    @IsOptional()
    paperId:PAPER;

    @IsOptional()
    sectionId:string;
}