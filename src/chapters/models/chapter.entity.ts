import { Video } from "src/videos/models/video.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GROUPS } from "./chapters.interface";

@Entity()
export class Chapter{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column()
    groupId:GROUPS;

    @OneToMany(()=>Video,(video:Video)=>video.chapter)
    videos:Video[];


}