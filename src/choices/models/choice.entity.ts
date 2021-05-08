import { SharedProps } from "src/helpers/sharedProps.helper";
import { Question } from "src/questions/models/question.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Choice extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    content:string;

    @Column({nullable:true})
    imgUrl:string;


    @ManyToOne(()=>Question,(question:Question)=>question.choices)
    @JoinColumn({name:'questionId'})
    question:Question;

    @Column()
    questionId:string;


}