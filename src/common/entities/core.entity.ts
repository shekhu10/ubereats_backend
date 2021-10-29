import {CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
@Entity()
export class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id: number;

    @CreateDateColumn()
    @Field(type => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(type => Date)
    updatedAt: Date;

}