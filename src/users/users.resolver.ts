import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";
import {CreateAccountInputDto, CreateAccountOutputDto} from "./dtos/create-account.dto";
import {LoginInputDto, LoginOutputDto} from "./dtos/login.dto";

@Resolver(of => User)
export class UsersResolver {
    constructor( private readonly userService: UsersService) {}
    @Query(returns => Boolean)
    get(): boolean {
        return false;
    }

    @Mutation(returns => CreateAccountOutputDto)
    async createAccount(@Args('input') createAccountInput: CreateAccountInputDto): Promise<CreateAccountOutputDto> {
        try {
            const {ok, error, message} = await this.userService.createAccount(createAccountInput);
            return {ok, error, message};
        }
        catch (e){
            return {ok: false, error: e}
        }
    }

    @Mutation(returns => LoginOutputDto)
    async loginAccount(@Args('input') login: LoginInputDto ): Promise<LoginOutputDto> {
        try {
            const {ok, error, message, token} = await this.userService.loginAccount(login);
            return {ok, error, message, token};
        }
        catch(e){
            return {ok: false, error: e};
        }
    }


}
