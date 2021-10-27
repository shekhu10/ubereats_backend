import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";

@Module({
  providers: [UsersResolver, UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
