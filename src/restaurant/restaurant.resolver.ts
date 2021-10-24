import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {Query} from "@nestjs/graphql";
import {Restaurant} from "./entities/restaurant.entity";
import {createRestaurantInputDto} from "./dtos/create-restaurant-input.dto";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    @Query(() => Restaurant)
    myRestaurant(): Restaurant {
        return {name: 'a', address:'addre', ownersName: 'ow'};
    }

    @Query(() => [Restaurant])
    restaurants(@Args('VeganOnly') isVegan: boolean ): Restaurant[] {
        return [];
    }

    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() create: createRestaurantInputDto
    ): boolean {
        console.log(create);
        return true;
    }
}