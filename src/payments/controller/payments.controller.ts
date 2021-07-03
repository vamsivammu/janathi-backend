import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/models/user.interface';
import { NewPaymentDto } from '../dto/NewPayment.dto';
import { PaymentsService } from '../service/payments.service';

@UseGuards(JwtGuard,RolesGuard)
@Controller('payments')
export class PaymentsController {

    constructor(
        private paymentService:PaymentsService
    ){  }

    @Post('create-session')
    @Roles(UserRole.USER)
    createSession(@Body() product:NewPaymentDto, @Req() req:Request){
        const id = req.user['id'] as string;
        return this.paymentService.initPayment(id,product.subscription);
    }

}
