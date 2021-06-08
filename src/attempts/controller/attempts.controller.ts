import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { AttemptsService } from '../service/attempts.service';

@Controller('attempts')
export class AttemptsController {
    constructor(private attemptsService:AttemptsService){   }

    

    @Get(':id')
    getAttempt(@Param('id',ParseUUIDPipe) attemptId:string){
        return this.attemptsService.getAttempt(attemptId);
    }

    

}
