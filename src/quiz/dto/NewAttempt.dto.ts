import { IsOptional } from "class-validator";
import { PAPER } from "src/papers/dto/paper.enum";

export class NewAttemptDto{
    @IsOptional()
    paperId:PAPER | null;
}