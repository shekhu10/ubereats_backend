import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";
import {ConfigModule} from "@nestjs/config";
import {JwtModule} from "../jwt/jwt.module";
import {AuthModule} from "../auth/auth.module";
import {Verification} from "./entities/verification.entity";
import {MailModule} from "../mail/mail.module";

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification]), ConfigModule, JwtModule, AuthModule, MailModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService]
})
export class UsersModule {}
