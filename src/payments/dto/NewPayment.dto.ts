import { IsDefined } from "class-validator";
import { Plans } from "./payment.enum";

export class NewPaymentDto{
    @IsDefined()
    subscription:Plans;
}