import {Field, InputType, ObjectType, PickType} from "@nestjs/graphql";
import {User} from "../entities/users.entity";
import {CoreoutputDto} from "../../common/dtos/output.dto";

@InputType()
export class CreateAccountInputDto extends PickType(User, ['email', 'password', 'role']) {}

@ObjectType()
export class CreateAccountOutputDto extends CoreoutputDto {}
