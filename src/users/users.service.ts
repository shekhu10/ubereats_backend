import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {CreateAccountInputDto, CreateAccountOutputDto} from "./dtos/create-account.dto";
import {LoginInputDto, LoginOutputDto} from "./dtos/login.dto";
import * as Jwt from 'jsonwebtoken';
import {ConfigService} from "@nestjs/config";
import {JwtService} from "../jwt/jwt.service";
import {EditProfileInputDto} from "./dtos/edit-profile.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user_repository: Repository<User>,
                private readonly config: ConfigService,
                private readonly jwtSerice_here: JwtService

    ) {}

    async createAccount({email, password, role}: CreateAccountInputDto): Promise<{ok:boolean, error?: string, message?: string}> {
        try {
            const exists = await this.user_repository.findOne({email});
            if (exists){
                return {ok: false, error: "user is already present"};
            }
            const new_user = this.user_repository.create({email, password, role});
            await this.user_repository.save(new_user);
            return {ok: true, message: "user created"};
        }
        catch(e){
            return {ok: false, error: "Couldn't create account"};
        }
    }

    async loginAccount({email, password}: LoginInputDto): Promise<LoginOutputDto> {
        try{
            const this_is_current_user = await this.user_repository.findOne({email});
            if (!this_is_current_user) {
                return {ok: false, message: 'user does not exist'};
            }
            // this means we have user.
            const password_matched = await this_is_current_user.checkPassword(password);
            if(!password_matched){
                return {ok: false, error: "wrong password"};
            }
            const token = this.jwtSerice_here.sign({id: this_is_current_user.id});
            return {ok: true, token};
        }
        catch(e){
            return {ok: false, error: e};
        }
    }

    async findById(id: number): Promise<User> {
        return this.user_repository.findOne({id});
    }

    async editProfile(userId: number, {email, password}: EditProfileInputDto): Promise<User> {
        const user = await this.user_repository.findOne(userId);
        if (email){
            user.email = email;
        }
        if (password){
            user.password = password;
        }
        return this.user_repository.save(user);
    }


}