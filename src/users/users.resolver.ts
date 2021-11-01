import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";
import {CreateAccountInputDto, CreateAccountOutputDto} from "./dtos/create-account.dto";
import {LoginInputDto, LoginOutputDto} from "./dtos/login.dto";
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";
import {AuthUser} from "../auth/auth-user.decorator";
import {UserProfileInputDto, UserProfileOutputDtos} from "./dtos/user-profile.dto";
import {EditProfileInputDto, EditProfileOutputDto} from "./dtos/edit-profile.dto";
import {VerifyEmailInputDtos, VerifyEmailOutputDtos} from "./dtos/verify-email.dtos";

@Resolver(of => User)
export class UsersResolver {
    constructor( private readonly userService: UsersService) {}
    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser;
    }

    @Query(returns => UserProfileOutputDtos)
    @UseGuards(AuthGuard)
    async userProfile(@Args() userProfileInput: UserProfileInputDto) {
        try {
            const user_to_be_found = await this.userService.findById(userProfileInput.UserId);

            if (!user_to_be_found) {
                throw Error();
            }
            return {
                ok: true,
                message: 'user is found',
                data: user_to_be_found
            }
        }
        catch(e){
            return {
                ok: false,
                error: "user not found"
            }
        }
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

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutputDto)
    async editProfile(@AuthUser() authUser: User,
                      @Args('input'
                      ) editProfileInputsHere: EditProfileInputDto): Promise<EditProfileOutputDto> {

        try{
            await this.userService.editProfile(authUser.id, editProfileInputsHere);
            return {ok: true};
        }
        catch(e){
            return {
                ok: false,
                error: e
            }
        }
    }

    @Mutation(returns => VerifyEmailOutputDtos)
    async verifyEmail(@Args('input') verifyEmailInputHere: VerifyEmailInputDtos) {
        try{
            const ok = await this.userService.verifyEmail(verifyEmailInputHere);
            if (ok){
                return {
                    ok,
                    message: "email verified"
                }
            }
            else{
                return {
                    ok,
                    error: "email not verified"
                }
            }
        }
        catch (e){
            return {
                ok: false,
                error: e
            }
        }
    }


}
