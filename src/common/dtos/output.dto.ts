import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class CoreoutputDto {
    @Field(type => String, {nullable: true})
    error?: string;

    @Field(type => String, {nullable: true})
    message?: string;

    @Field(type => Boolean)
    ok: boolean;
}