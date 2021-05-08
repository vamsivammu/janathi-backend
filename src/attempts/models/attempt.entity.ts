import { SharedProps } from "src/helpers/sharedProps.helper";
import { Quiz } from "src/quiz/models/quiz.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attempt extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>User,(user:User)=>user.attempts)
    @JoinColumn()
    user:User;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.attempts)
    @JoinColumn()
    quiz:Quiz;

    @Column()
    score:number;

}