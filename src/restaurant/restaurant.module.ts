import { Module } from '@nestjs/common';
import {RestaurantResolver} from "./restaurant.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";
import {RestaurantService} from "./restaurant.service";

@Module({
    providers: [RestaurantResolver, RestaurantService],
    imports: [TypeOrmModule.forFeature([Restaurant])],
})
export class RestaurantModule {}
