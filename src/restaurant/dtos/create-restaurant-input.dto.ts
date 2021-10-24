import {ArgsType, Field, InputType} from "@nestjs/graphql";
import { IsString, Length } from "class-validator";

@ArgsType()
export class createRestaurantInputDto {
    @Field(is => String)
    @Length(5,10)
    @IsString()
    name: string;

    @Field(is => Boolean, { nullable: true})
    isVegan?: boolean;

    @Field(type => String)
    address: string;

    @Field(type => String)
    @IsString()
    ownersName: string;
}