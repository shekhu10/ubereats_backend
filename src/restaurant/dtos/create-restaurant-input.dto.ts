import {ArgsType, Field, InputType, OmitType} from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import {Restaurant} from "../entities/restaurant.entity";

@InputType()
export class createRestaurantInputDto extends OmitType(Restaurant, ["id"]){}
