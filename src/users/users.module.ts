import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "../jwt/jwt.module";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, JwtModule, AuthModule ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
