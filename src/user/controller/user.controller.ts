import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { IUser, UserRole } from '../models/user.interface';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
    constructor(private userService:UserService){    }

    @Post()
    create(@Body() user:IUser):Promise<IUser>{
        return this.userService.create(user);
    }

    @UseGuards(JwtGuard,RolesGuard)
    @Roles(UserRole.USER)
    @Get()
    findOne(@Req() req:Request):Promise<IUser>{
        return this.userService.findOne(req.user['id']);
    }
}
