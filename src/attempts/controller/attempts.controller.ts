import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUserBody } from 'src/auth/models/auth.interface';
import { ResponsesDto } from 'src/responses/dto/responses.dto';
import { UserRole } from 'src/user/models/user.interface';
import { AttemptsService } from '../service/attempts.service';

@UseGuards(JwtGuard,RolesGuard)
@Controller('attempts')
export class AttemptsController {
    constructor(private attemptsService:AttemptsService){   }


    @Get('/score/:id')
    @Roles(UserRole.USER)
    getAttemptScore(@Param('id',ParseUUIDPipe) attemptId:string, @Req() request:Request){
        return this.attemptsService.getAttemptScore(attemptId,request.user['id']);
    }

    @Get(':id')
    @Roles(UserRole.USER)
    getAttempt(@Param('id',ParseUUIDPipe) attemptId:string,@Req() request:Request){
        return this.attemptsService.getAttempt(attemptId,request.user as IUserBody);
    }

    @Post(':id')
    @Roles(UserRole.USER)
    submitResponses(@Param('id',ParseUUIDPipe) attemptId:string,@Req() request:Request, @Body() responses:ResponsesDto){
        return this.attemptsService.submitResponses(attemptId,responses,request.user['id']);
    }

    @Delete(':id')
    @Roles(UserRole.USER)
    deleteAttempt(@Param('id',ParseUUIDPipe) attemptId:string,@Req() req:Request){
        return this.attemptsService.deleteAttempt(attemptId,req.user['id']);
    }
    
}
