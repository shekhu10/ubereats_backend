import {Field, InputType, ObjectType, PickType} from "@nestjs/graphql";
import {CoreoutputDto} from "../../common/dtos/output.dto";
import {User} from "../entities/users.entity";


@ObjectType()
export class LoginOutputDto extends CoreoutputDto {
    @Field(type => String, {nullable: true})
    token?: string;
}


@InputType()
export class LoginInputDto extends PickType(User, ['email', 'password']) {}