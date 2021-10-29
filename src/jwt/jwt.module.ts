import {DynamicModule, Global, Module} from '@nestjs/common';
import { JwtService } from './jwt.service';
import {JwtModuleOptions} from "./jwt.interfaces";
import {CONFIG_OPTIONS} from "./jwt.constants";
import {UsersService} from "../users/users.service";
import {UsersModule} from "../users/users.module";

@Module({})
@Global()
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                JwtService],
            exports: [JwtService],
            imports: [UsersModule],
        };
    }
}

