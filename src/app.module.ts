import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {join} from 'path';
import { RestaurantModule } from './restaurant/restaurant.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as Joi from 'joi';
import {Restaurant} from "./restaurant/entities/restaurant.entity";


@Module({
  imports: [
      GraphQLModule.forRoot({
        autoSchemaFile: true,
      }),
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev': '.env.test',
          ignoreEnvFile: process.env.NODE_ENV === 'prod' ? true: false,
          validationSchema: Joi.object({
              NODE_ENV: Joi.string()
                  .valid('dev','test','prod')
                  .required(),
              DB_HOST: Joi.string()
                  .required(),
              DB_PORT: Joi.string()
                  .required(),
              DB_USERNAME: Joi.string()
                  .required(),
              DB_PASSWORD: Joi.string()
                  .required(),
              DB_NAME: Joi.string()
                  .required()
          })
      }),
      TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          logging: true,
          entities: [Restaurant]

      }),
      RestaurantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
