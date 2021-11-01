import {CoreoutputDto} from "../../common/dtos/output.dto";
import {InputType, ObjectType, PickType} from "@nestjs/graphql";
import {Verification} from "../entities/verification.entity";

@ObjectType()
export class VerifyEmailOutputDtos extends CoreoutputDto {}

@InputType()
export class VerifyEmailInputDtos extends PickType(Verification, ["code"]) {}