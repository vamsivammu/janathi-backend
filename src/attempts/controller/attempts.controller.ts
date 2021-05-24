import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { AttemptsService } from '../service/attempts.service';

@Controller('attempts')
export class AttemptsController {
    constructor(private attemptsService:AttemptsService){   }

    @Get(':id')
    getAttemptInfo(@Param('id',ParseUUIDPipe) attemptId:string){

    }
}
