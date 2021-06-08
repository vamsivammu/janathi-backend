import { IsDefined } from "class-validator";

export class ResponsesDto{
    @IsDefined()
    questionIdMap:any;

    @IsDefined()
    responseIdMap:any;
}