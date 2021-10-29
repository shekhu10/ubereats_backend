import {CoreoutputDto} from "../../common/dtos/output.dto";
import {InputType, ObjectType, PartialType, PickType} from "@nestjs/graphql";
import {User} from "../entities/users.entity";

@InputType()
export class EditProfileInputDto extends PartialType(
    PickType(User, ['email', 'password'])
    ) {}

@ObjectType()
export class EditProfileOutputDto extends CoreoutputDto{}