import { SharedProps } from "src/helpers/sharedProps.helper";
import { Question } from "src/questions/models/question.entity";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Section extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column()
    name:string;

    @OneToMany(()=>Question,(question:Question)=>question.section)
    questions:Question[]


    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.sections)
    @JoinColumn({name:'quizId'})
    quiz:Quiz;

    @Column()
    quizId:string;

}