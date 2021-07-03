import { PAPER } from "src/papers/dto/paper.enum";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class QuizPdfs{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.files)
    @JoinColumn()
    quiz:Quiz;

    @Column()
    quizId:string;

    @Column({nullable:true})
    paperId:PAPER|null;
}