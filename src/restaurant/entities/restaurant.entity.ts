import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsOptional, IsString, Length} from "class-validator";


@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(is => Number, {nullable: true})
    id?: number;

    @Field(is => String)
    @Column()
    @IsString()
    @Length(5,10)
    name: string;

    @Field(is => Boolean, { nullable: true, defaultValue: true})
    @Column({default: true})
    @IsOptional()
    @IsBoolean()
    isVegan?: boolean;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownersName: string;
}