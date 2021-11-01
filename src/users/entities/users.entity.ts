import {BeforeInsert, BeforeUpdate, Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import {InternalServerErrorException} from "@nestjs/common";
import {IsBoolean, IsEmail, IsEnum, IsString} from "class-validator";

enum UserRole { "client", "owner" , "delivery" }
registerEnumType(UserRole, {name: 'UserRole'})




@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({select: false})
    @Field(type => String)
    @IsString()
    password: string;

    @Column({type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({default: false})
    @Field(type => Boolean)
    @IsBoolean()
    isVerified: boolean;


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if(this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(password_currently_entered_by_user: string): Promise<boolean> {
        try{
            const ok = await bcrypt.compare(password_currently_entered_by_user, this.password);
            return ok;
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

}