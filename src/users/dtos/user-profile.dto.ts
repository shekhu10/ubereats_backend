import {ArgsType, Field, ObjectType} from "@nestjs/graphql";
import {CoreoutputDto} from "../../common/dtos/output.dto";
import {User} from "../entities/users.entity";

@ArgsType()
export class UserProfileInputDto {
    @Field(type => Number)
    UserId: number;
}

@ObjectType()
export class UserProfileOutputDtos extends CoreoutputDto{
    @Field(type => User, {nullable: true})
    data?: User;
}