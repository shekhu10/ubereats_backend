import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {Query} from "@nestjs/graphql";
import {Restaurant} from "./entities/restaurant.entity";
import {createRestaurantInputDto} from "./dtos/create-restaurant-input.dto";
import {RestaurantService} from "./restaurant.service";
import {UpdateRestaurantInputDto} from "./dtos/update-restaurant-input.dto";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {
    }

    @Query(() => Restaurant)
    myRestaurant(): Restaurant {
        return {name: 'a', address:'addre', ownersName: 'ow'};
    }

    @Query(() => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }

    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args('input') create: createRestaurantInputDto
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(create);
            return true;
        }
        catch (e){
            return false;
        }
    }

    @Mutation(returns => Boolean)
    async updateRestaurant(
        @Args() up: UpdateRestaurantInputDto
    ): Promise<boolean>{
        try{
            await this.restaurantService.updateRestaurant(up);
            return true;
        }
        catch(e){
            return false;
        }
    }

}