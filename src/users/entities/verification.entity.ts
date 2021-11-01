import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {User} from "./users.entity";
import {v4 as uuidv4} from 'uuid';


@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Verification extends CoreEntity{

    @Field(type => String)
    @Column()
    code: string;

    @OneToOne(type => User, {onDelete:"CASCADE"})
    @JoinColumn()
    thisIsForeignKeyToUser: User;

    @BeforeInsert()
    createCode(): void {
        this.code = uuidv4();
    }
}