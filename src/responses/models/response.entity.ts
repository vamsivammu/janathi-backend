import { Attempt } from "src/attempts/models/attempt.entity";
import { Choice } from "src/choices/models/choice.entity";
import { Question } from "src/questions/models/question.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Response{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>Attempt,(attempt:Attempt)=>attempt.responses)
    @JoinColumn()
    attempt:Attempt;

    @Column()
    attemptId:string;
    
    @ManyToOne(()=>Choice)
    @JoinColumn()
    choice:Choice;

    @Column({nullable:true})
    choiceId:string;

    @ManyToOne(()=>Question)
    @JoinColumn()
    question:Question;

    @Column()
    questionId:string;
}