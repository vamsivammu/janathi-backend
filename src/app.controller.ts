import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments/service/payments.service';

@Controller()
export class AppController {
  constructor(private paymentService:PaymentsService) {}

  @Post('stripe-webhook')
  handleWebhook(@Req() req:Request,@Res({passthrough:true}) res){
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = this.paymentService.stripe.webhooks.constructEvent(req.body, sig, 'whsec_dFZ8Meq0mHVMqzscTwyKdS7nLa9Gg9Fm');
      return this.paymentService.handleWebhook(event);
    }
    catch (err) {
      console.log(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }

  }
}
