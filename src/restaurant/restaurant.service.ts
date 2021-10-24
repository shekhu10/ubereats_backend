import {Injectable} from "@nestjs/common";
import {Restaurant} from "./entities/restaurant.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {createRestaurantInputDto} from "./dtos/create-restaurant-input.dto";
import {UpdateRestaurantInputDto} from "./dtos/update-restaurant-input.dto";


@Injectable()
export class RestaurantService {
    constructor(@InjectRepository(Restaurant) private readonly resta_name: Repository<Restaurant>) {}

    getAll(): Promise<Restaurant[]>{
        return this.resta_name.find();
    }

    createRestaurant(input_params: createRestaurantInputDto) {
        const newRestaurant = this.resta_name.create(input_params);
        return this.resta_name.save(newRestaurant);
    }

    updateRestaurant({id, data}: UpdateRestaurantInputDto) {
        this.resta_name.update(id, {...data});
    }

}