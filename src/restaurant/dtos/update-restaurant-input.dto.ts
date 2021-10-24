import {ArgsType, Field, InputType, PartialType} from "@nestjs/graphql";
import {createRestaurantInputDto} from "./create-restaurant-input.dto";

@InputType()
export class UpdateRestaurantDto extends PartialType(createRestaurantInputDto) {}

@ArgsType()
export class UpdateRestaurantInputDto {
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantDto)
    data: UpdateRestaurantDto;
}