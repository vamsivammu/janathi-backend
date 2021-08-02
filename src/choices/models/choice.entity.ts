import { SharedProps } from "src/helpers/sharedProps.helper";
import { Question } from "src/questions/models/question.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Choice extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({nullable:true})
    content:string;

    @Column({nullable:true})
    imgUrl:string;

    @ManyToOne(()=>Question,(question:Question)=>question.choices,{onDelete:'CASCADE'})
    @JoinColumn({name:'questionId'})
    question:Question;

    @Column()
    questionId:string;


}