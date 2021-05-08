import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class SharedProps{
    @CreateDateColumn({
        default:()=>`CURRENT_TIMESTAMP`,
        type:'timestamp without time zone'
    })
    created_at:Date;

    @UpdateDateColumn({
        default:()=>`CURRENT_TIMESTAMP`,
        type:'timestamp without time zone'
    })
    updated_at:Date;
}