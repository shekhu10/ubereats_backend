Q) Resolver(() => Boolean) =>
@Query(() => Boolean) -> we have to do this to exxplicitly tell that our query is going to return Boolean
@InputType() -> @Args('input) ?, ObjectType(), ArgsType()
async await should be in resolver. ?
repository returns the promise in the service and the function is called from resolver.
// we want some default values from graphQL and add then in our db.

--------------------------------- Section 1 -------------------------------------------------------------------------


`nest g application <name>`
to run the application in dev mode -> `npm run start:dev`

use gitignore (extension in vs code)
    go to command pallete (cmd + p) and type (>git) and (select add gitignore)

Now we got o documentation of nest js, there in quickstart of graphql section, they show how to get started in graphql

`npm i @nestjs/graphql graphql-tools graphql apollo-server-express`

`npm i @nestjs/graphql graphql-tools graphql apollo-server-express class-validator class-transformer`

this runs on the top of the appolo-server.

Now delete app controller and app service
NOTE: app.module is the only module that is imported in main.ts. So, everything must be added in app.module.ts
Our application starts from app.module.ts.
So, this means that we have to add our graphql module in app.module.ts

import  graphQl module in app module and configure root module (.forRoot())

```
import { GraphQLModule } from '@nestjs/graphql';
imports: [GraphQLModule.forRoot()],
```

So, this is like create a appolo server the nest.js way. But we are not sending type defs and resolvers.
THIS WILL GIVE A ERROR THAT APPOLO SERVER REQUIRES A EXISTING SCHEMA, MODULE OR TYPEDEFS (to create a appolo server -> we neeed typedefs(graphql schema) and resolvers(functions that populate data for the schema fields))
THIS MEANS WE NEED TO EXPLAIN GRAPHQL SERVER HOW EVERYTHING LOOKS HERE. We need resolvers for that.

Now if we look at the documentation, we see that we have 2 options --
Now, to give type defs and resolvers, we have 2 options -
Code first
Schema first
We are going to choose code first approach.

So, add autoschemafile lime from documentation... Note this line is added in {} (curly braces).
(join in the above line must be from path)
if we put autoSchemaFile: true then our schemafile is made on memory. This is also good.

```
import {join} from 'path';

GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
```
Now the error is the Query root type must be provided. and schema generation error happened.
This means we don't have a query or mutation.

This means we need to create resolver, as we do not have query and we put query in resolvers.


Now let's create a module restaurant. `nest g mo restaurant`
Note this module must be in imports of app.module. (it is done automatically)
now create a restaurant resolver.
this resolver is automatically added in providers of restaurant module.
Now in the resolver make a Query using Query decorator (from '@nestjs/graphql' (not from '@nestjs/common')) inside the class. Note Query decorator must have type that it returns as a result of graphQl query.

You can create restaurant resolver via `nest g r <name>`
or you create a file in restaurant folder as restaurant.resolver.ts
(doing it the 2nd way)
In the file, use decorator as 
@Resolver()
This Resolver will be imported from @nestjs/graphql.
And now create a class as RestaurantResolver and export it.


NOTE - if u get error UnhandledPromiseRejectionWarning: Error: You must `await server.start()` before calling `server.applyMiddleware()`
then reduce version in package.json to "apollo-server-express": "^2.17.0",

after this, http://localhost:3000/graphql must work


```
import {Resolver} from "@nestjs/graphql";

@Resolver()
export class RestaurantResolver {}
```

Add RestaurantResolver in providers of restaurant.module

```
import { Module } from '@nestjs/common';
import {RestaurantResolver} from "./restaurant.resolver";

@Module({
    providers: [RestaurantResolver],
})
export class RestaurantModule {}
```

Now, we need to create a query. So, in RestaurantResolver class we are going to create a query.
To create a query, we are going to use the @Query() 
Query() decorator needs a little bit of information. It needs what it is going to return.
so, we do 
```
import {Resolver} from "@nestjs/graphql";
import {Query} from "@nestjs/graphql";

@Resolver()
export class RestaurantResolver {
    @Query(() => Boolean)
    find(): boolean {
        return false;
    }
}
```

Now do -> http://localhost:3000/graphql 


Now we are going to use object types. Now create a folder entities in restaurant folder and then create a file restaurant.entity.ts
Now use a ObjectType() decorator in this file. ObjectType is for graphQL. (it is from "@nestjs/graphql")
now create a class which is going to have the structure
and use Field decorator to define the field in graphQL query.

```
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class Restaurant {
    
    @Field(is => String)
    name: string;
    
}
```

Now in our Resolver in @Resolver, we can do like this -
`@Resolver(of => Restaurant)`
This means that our resolver is of Restaurant.
So, now we are going the change our query as -

```
import {Resolver} from "@nestjs/graphql";
import {Query} from "@nestjs/graphql";
import {Restaurant} from "./entities/restaurant.entity";

@Resolver(of => Restaurant)  // @Resolver() -> this is also fine, of => Restaurant is not mandatory.
export class RestaurantResolver {
    @Query(() => Restaurant)
    myRestaurant(): Restaurant {
        return {name: 'shekhar'};
    }
}
```


Now resolver can return this class. So, update query decorator and the function below it return this structure (class).
we can use {nullable: true} in field decorator. this means that field is optional. we have to use '?' in the actual field below like ->     
name?: boolean;
! in http://localhost:3000/graphql docs means it is compulsary, if we do ? and nullable then there is no ! in front of that field.

```
@Field(is => Boolean, { nullable: true})
isVegan?: boolean;
```

Now before we do mutation, let's do arguments on query. ie. pass arguments in qraphql.
like -> restaurant(isVegan: true){name}


Note: in typescript we use array as arr[] but in graphql we use as [arr], so in query decorator we use graphql way and in function we use typescript way.Also, all types like boolean, string have 1st character capital in graphql way.
So, to get the arg isVegan, we use decarator @Args, (Args is from '@nestjs/graphql')
like ->     find(@Args('isVegan') isVegan: string)

In nestjs, we need to ask for things. like @Args('isVegan'). Arguments will not show up automatically, we have to ask for them.

```
@Query(() => [Restaurant])
    restaurants(@Args('VeganOnly') isVegan: boolean ): Restaurant[] {
        return [];
    }
```

if we do isVegan: string then this will be read as string

```
@Query(() => [Restaurant])
    restaurants(@Args('VeganOnly') isVegan: string): Restaurant[] {
        return [];
    }
```

We will query as

```
query {
  restaurants(VeganOnly: true){
  	name
    isVegan
  }
}
```


Now, let's create a mutation
use @Mutation(returns => boolean)

Let's say our restaurant is bigger. i.e it has a big schema...
So, in this we have to use @Args multiple times to get the values to pass in the function.

OTHER WAY, better way, is to use InputTypes(), 
it allows us to pass a whole object (like entity). 
it is some sort of dto (data transfer object). 
so create dto folder and create a file create-restaurent.dto.ts in dtos folder (inside restaurant folder)

In this file, this file is same as entity file except we are using argstype() instead of ObjectType().
Now in resolver we can use this class in our mutation function.
like -> create( @Args() in_this_fn_name: dto_file_class_name ) { }

```
@Mutation(returns => Boolean)
    createRestaurant(
        @Args('createRestaurantInput') create: createRestaurantInputDto
    ): boolean {
        console.log(create);
        return true;
    }
```
Now to query we do as, 

```
mutation{
  createRestaurant(createRestaurantInput: {
    name: "af",
    address: "wedf",
    ownersName: "qw"
  })
}
```

Now, we want to give input as 
```
mutation{
  createRestaurant(
    name: "af",
    address: "wedf",
    ownersName: "qw"
  )
}
```

To do so, we are going to update our resolver as.. Note that we have removed name from inside of Args
```
@Mutation(returns => Boolean)
    createRestaurant(
        @Args() create: createRestaurantInputDto
    ): boolean {
        console.log(create);
        return true;
    }
```


So, this thing is going to give us an error (UnhandledPromiseRejectionWarning). So, to remove this error we update our create restaurant input dtos from @InputType() to @ArgsType().

We can also use inputTypes() instead of argstype()
like ->   create( @Args('graphql_page_name') in_this_fn_name: dto_file_class_name ) { }
Note We are using decorator as @Args. and in dto we are using @InputType().
Also note that when we use input type we have to give some name in @args(<here>).

So, by doing it this way,(using input types) in graphql we do like
createRestaurant(graphql_page_name: {name: "asdfn", val: "asd"})
this sucks.

So, to do it in better way,  we use  create( @Args() in_this_fn_name: dto_file_class_name ) { }.
But this gives an error, as we can not use inputtype if inputtype (in @args()) does not have a name,
so instead we are going to use @ArgsType instead of InputType.
This allows all fields in dto as different arguments, and input types allows all arguments as 1 entity (1 object).

now we can pass as normal -> ie         createRestaurant(
name: "asdff"
value: "asdf"
)


now we need to validate our dtos. 
for this we use class validators (validation pipes)
we can use IsString(), IsBoolean() decorators in our dtos.
To make it work we need to create our validation pipelines.
`npm i class-validator class-transformer`
So, in our application (main.ts), we are going to use a middleware, as app.useGlobalPipes(new ValidationPipe())

```
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();

```
So, in dtos we are going to use IsString(), IsBoolean() decorators and many more


--------------------------------- Section 2 -------------------------------------------------------------------------



To talk to our db we can write SQL directly, or we can use type ORM. We can also test our interaction with our DB with TypeORM. TypeORM works on node js and many others. It also works on frontend.
Type ORM supports many DB's (in documentation, in connection-options).

We are going to use it with postgres. so install postgresapp.com (MAC) and then install postico (MAC) or pgAdmin4(windows). postico is to do queries on posgres. Now create your database from postico.
Now in postico, open nuber-eats-backend-db db. and run \du; this gives all usernames. and username must be here. 
Then run ALTER USER shekharbhardwaj WITH PASSWORD '12345'; // this is important because we are going to connect to our user later.


Now, we have setup our DB, we are going to connect to our DB using nestJS. (we can also use sequelize(it is something like typeORM), or mongoose (for mongo DB)). typeorm is natively made in typescript and sequelize is natively made in javascript. sequelize only works on nodejs and typeORM is used on many platform.
So, now run
`npm install --save @nestjs/typeorm typeorm pg` (for postgres, if we want for mysql, we use mysql in place of pg)

TypeOrmModule is to be added in app.module. TypeOrmModule is imported from @nestjs/typeorm

Now typeORM module is put in imports of app.module. and use forroot() and here we put connection object. (connection object is used to connect to our DB, things like type, username, password).
these options have values like
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'shekharbhardwaj',
password: '12345',
database: 'nuber-eats-backend-db',
synchronize: true,
logging: true

Note: password is not required when connecting via localhost. 
username must be the username which is found in \du in postico. 
port should be number and it is found in server settings. 
database must be created before adding these lines as we just connect to db and not create it here. 
synchronize means to run everything and sync it with DB, we do want it while developing but we do not want it while in production. 
logging to give logs in our server.

```
TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'shekharbhardwaj',
          password: '12345',
          database: 'nuber-eats-backend-db',
          synchronize: true,
          logging: true

      }),
```


Now we need to put these options in a env file so that we can use it based on environment like test, dev, or prod.
To do this we use ("dotenv") but we do it nestjs way,
i.e. configuration module (from documentation), it runs on top of dotenv.
So, add configmodule in app.module and use forroot().
But to use ConfigModule we need to install dependency as `npm i --save @nestjs/config`

Now, on top of typeOrmModule, we are also going to use config module and forRoot()
we are going to provide some options to it.
options - isGlobal: true,   this means that we are going to use this configuration module from everywhere in our application.
envFilePath:  we are going to use ternary operator to give different env files based on environment.

Eg-   if we use npm run start, I want it to use prod env file,
if we use npm run start:dev, I want it to use dev env file


To set an enviromnent we are going to use `npm i cross-env`
now edit package.json
in start:dev
we do -> "cross-env NODE_ENV=dev nest start --watch" in place of nest start --watch
now in app.module in configModule, in envFilePath, we can use
process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod'
There is 1 more option, ignoreEnvFile. this will be true if we deploy on prod
so process.env.NODE_ENV === 'prod' ? true: false


So, now transfer all options (ONLY DB CONNECTION) of typeOrm module to dev env. And use process.env.DB_HOST (//ly others).
Everything that comes from env, it is in the form of string and port must be number so add a '+' in front of it,
NOTE: In env FILE we use format like DB_NAME=testdb

Now we also want to validate the values that we send via env file, we do this in  the configModule options.
In the options there is an option validationSchema.
So, we want that our application does not start if some of arguments in connection object is missing.


So, to validate we are going to use joi. ->  `npm i joi`
Joi is a javascript module. javascript modules have a different import way.
like -> import * as Joi from 'joi'; add this line in app.module.ts
if we use import Joi from 'joi'; typescript way. then it is not imported. console.log(Joi) in undefined.
So, validationSchema will get Joi.object({here we validate})
like {NODE_ENV: Joi.string().valid('dev','test','prod').required(), DB_HOST: and so on}
like    validationSchema: Joi.object({NODE_ENV: Joi.string().valid('dev','test','prod').required(), DB_HOST: and so on})

This is current app.module.ts
```
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {join} from 'path';
import { RestaurantModule } from './restaurant/restaurant.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import * as Joi from 'joi';


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
              DB_HOST: Joi.string().required(),
              DB_PORT: Joi.string().required(),
              DB_USERNAME: Joi.string().required(),
              DB_PASSWORD: Joi.string().required(),
              DB_NAME: Joi.required()
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
          logging: true

      }),
      RestaurantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```



--------------------------------- Section 3 -------------------------------------------------------------------------



Now we are connected to our DB via typeORM.
So, now we need to create tables and define their schema.
Note we are doing code first approach.
And we do @Entity() (like ObjectType)decorator to do this.
and @Column() is used in place of @Field() and for primary key we use @PrimaryGeneratedColumn() decorator.
these decorators are imported from type orm.
So, we are going to use these decorators in the same entities file.
This is not going to work because we have created the columns of the table but we have not told typeorm that from where it must take the schema.
So, in TypeOrm module.forroot in app.module. we must add entities: [<entity class name>]


ObjectType -> graphql takes to build our automatically generated schema.
Entity -> will make typeORM to save entity to our DB.

NOTE: we must have primary generated column.

```
import {Field, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(is => Number, {nullable: true})
    id?: number;

    @Field(is => String)
    @Column()
    name: string;

    @Field(is => Boolean, { nullable: true})
    @Column()
    isVegan?: boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownersName: string;

}
```

if we add id. We must also have it for graphQL, we are not able to have it like it is there for DB but not for GraphQL.
So, we put nullable as true.


Now how to save data and get data from DB ?
Now to interact with DB we are going to use Repository.
there are 2 ways to interact with DB - active mapper and data mapper.
Active Mapper is used for small applications.
Data Mapper has more maintainablity. Why ?
Because as we are using nest js, and nestjs has a thing to inject, so we can inject Repositories in our services and tests also. So, we can do testing well.

and we are going to use data mapper. (this is from nest js documentation).
with data mapper we first have to import repository and this repository is incharge of to interact with DB.
nest js can automatically can inject repository on classes.

So, now we need to interact with our DB and with data mapper we need to import Repository in the module.
So, we choose Restaurant module (not app.module) because we are going to interact with our restaurant DB in restaurant service and resolvers.
Repository is imported as TypeOrmModule.forfeature([Restaurant]), Restaurant is the entity class.

```
import { Module } from '@nestjs/common';
import {RestaurantResolver} from "./restaurant.resolver";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Restaurant} from "./entities/restaurant.entity";

@Module({
    providers: [RestaurantResolver],
    imports: [TypeOrmModule.forFeature([Restaurant])],
})
export class RestaurantModule {}
```

Now, create a service as restaurant.service.ts in restaurant folder.
And make this service as Injectable via @Injectable().
Now, let's inject our restaurantService in our restaurant Resolver.


Now import restaurantservice in our restaurant resolver and the funciton in restaurant resolver is going to return the function of resturant service.
To use restaurant service in restaurant resolver we need to import restaurant service in restaurant resolver.
constructor(private readonly restaurantService: RestaurantService){}
restaurantService must be in providers of restaurant module to be able to inject here in resolver.


Restaurant resolver
```
import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {Query} from "@nestjs/graphql";
import {Restaurant} from "./entities/restaurant.entity";
import {createRestaurantInputDto} from "./dtos/create-restaurant-input.dto";
import {RestaurantService} from "./restaurant.service";

@Resolver(of => Restaurant)
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) {
    }

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
```

Now, we are getting error as Nest can't resolve dependencies of the RestaurantResolver (?). 
Please make sure that the argument RestaurantService at index [0] is available in the RestaurantModule context.

To resolve this, we must add restaurantService in providers of restaurant.module.ts

To use TypeOrm repository in restaurant service we need to inject restaurant repository in the restaurant service.
`constructor(@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant> ){}`

now we can use this.restaurants.(here we can access all function of the repository). {Restaurant is entity}
All the functions of the repository are async function, so we need to return promise in the function that uses the DB.

Now, in restaurant.service
We can do something like


```
createRestaurant(input_params: createRestaurantInputDto) {
        const newRestaurant = new Restaurant();
        newRestaurant.name = input_params.name;
        and so on
    }
```

TypeOrm Provides us with a method as create and this creates a new instance
```
createRestaurant(input_params: createRestaurantInputDto) {
        const newRestaurant = this.resta_name.create({name: input_params.name, owner_name: imput_params.owner_name, and so on});
        
    }
```

And we know that input_params is same as createRestaurantInputDto and we also know that createRestaurantInputDto is same as our restaurant entity because we created it.
We are directly going to use it like --

```
createRestaurant(input_params: createRestaurantInputDto) {
        const newRestaurant = this.resta_name.create(input_params);
    }
```

Now we have newRestaurant on our memory, and to save this on our DB.
we are going to use save method as

```
createRestaurant(input_params: createRestaurantInputDto) {
        const newRestaurant = this.resta_name.create(input_params);
        return this.resta_name.save(newRestaurant);
    }
```

Note that: create returns a restaurant and save returns a promise.

Now, let's go to our resolver and we change our createRestaurant function to async function. 
And, also we want to return ok: true, message: some_msg if we are able to create restaurant successfully,
or ok: false, error: err_msg if we are not able to create restaurant.
Also note as the function in resolver is asynchronous it is going to return a promise.

ALSO NOTE: WE ARE NOT SENDING ID IN CREATE_RESTAURANT_INPUT_DTOS BUT WE HAVE IT IN OUR DB. THIS IS BECAUSE ID IS OUR PRIMARY GENERATED COLUMN.


Now we may have a possibility that our createRestaurantDTO is not synced up with entity.
Eg - we make a new field category_name in entity but we forgot to make category_name in createrestaurantInputDTO.
So, the current problem is that DTO is not synced with entity.
So, this will give us error as null value violates not-null constraint on category_name.


So, we can either fix this by copy pasting in createRestaurantDTO.
The other way is to, something like restaurant entity is going to generate graphQl type
(already does this, as we use object type in entites),
our DB table (already does this as we used entity decorator) and also our DTO's (we need to do this).

So to do this we are going to use mapped types.
There are 4 mapped types ->
partial (it takes a base class, and creates a new class with all fields as optional),
```
@InputType()
export class RestaurantInputDTO extends PartialType(Restaurant){}
```

pick(it constructs a new class by selecting some fields from base class),
```
@InputType()
export class RestaurantInputDTO extends PickType(Restaurant, ['email']){}
```

omit (it constructs a new class by omiting some fields from base class),
```
@InputType()
export class RestaurantInputDTO extends OmitType(Restaurant, ['email']){}
```

intersection
```
@InputType()
export class RestaurantInputDTO extends IntersectionType(RestaurantTypeA, RestaurantTypeB){}
```

So, in DTO's we are going to use something like PartialType or Something else
like -
@InputType()
export class restaurantDTO extends PicKType(Restaurant, ['email']) {}
we are going to use OmitType.

_**Note: this mapped types use InputType. So, we need to have change as per the input type.**_

So, in resolver in our createRestaurant function in @Args() we do @Args('input') and change out createRestaurantInputDto as inputType()
This results in mutation as

```
mutation{
  createRestaurant(input: {
    name:"shekh",
    ownersName: "ownername",
    address: "this is address",
    isVegan: true
  	}
  )
}
```
Now, let's update createRestaurantInputDto as

```
@InputType()
export class createRestaurantInputDto extends OmitType(Restaurant, ["id"]){}
```

This is also having an error as: Input Object type createRestaurantInputDto must define one or more fields. (this error is very cryptic)
This means that our base class must also be inputType, but in our case it is Object type.
Basically, the problem is that these partial types also has a optional secondary parameter. And when that parameter is not provided than the child class is of same type as that of parent class.
So, it doesn't matter what is the type of parent class but our child class is of InputType.
In our case, as parent class is ObjectType, the child class also tries to be of object type. But child class has to be of InputType because this is the requirement of mapped types.



So we either convert it to inputtype (and do many more changes)
OR
We pass optional 2nd param as
```
@InputType()
export class createRestaurantInputDto extends OmitType(Restaurant, ["id"], InputType){}
```
OR
in restaurant.entity.ts we convert it to abstract input type as @InputType({isAbstract: true}) as
```
import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsBoolean, IsString, Length, IsOptional} from "class-validator";

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(is => Number, {nullable: true})
    id?: number;

    @Field(is => String)
    @Column()
    @IsString()
    @Length(5,10)
    name: string;

    @Field(is => Boolean, { defaultValue: true })
    @Column({default: true})
    @IsBoolean()
    @IsOptional()
    isVegan?: boolean;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownersName: string;
}
```

Note we can validate as shown above. By doing here, we are validating our DTO's as well as our entities.

input is taken as -
```
mutation{
  createRestaurant(input: {
    name:"shekh",
    ownersName: "ownername",
    address: "this is address",
    isVegan: true
  	}
  )
}
```
Note that we are sending isVegan everytime but I don't want to send it all the time, I want it to be optional.

For dto @optional() (this is from class validator),
for DB @Column({default: true(case of boolean)}),
for graphQL. @Field(() => Boolean, {defaultValue: true}). OR
For graphQl we have default value as true as per above line but we have 2 cases

```
@Field(() => Boolean, {defaultValue: true})
```
in case of defaultValue we see default value in graphQl docs.

```
@Field(() => Boolean, {nullable: true})
```
if we use nullable this means that this value can be null.
```
@Field(() => Boolean, {nullable: true, defaultValue: true})
```
if we use nullable and default value  then if we won't provide this value than default value will be taken (true here)



Curently our create restaurant function in our resolver is as

```
    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args('input') create: createRestaurantInputDto
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(create);
            return true;
        }
        catch (e){
            return false;
        }
    }
```

and our create restaurant function in our service is as

```
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
}
```

Before starting cloning we are going to create update a restaurant feature.
Now make Update a restaurant mutation
we need to create a differentDTO for update. and we will use partial type because partial type is going to make all the properties as optional.
we are going to use partial type on createRestaurantInputDto and not on restaurant because Id has to be required. and in createRestaurantInputDto we omit id.
So, if I do partial type of restaurant then even id will be partial

```
import {InputType, PartialType} from "@nestjs/graphql";
import {createRestaurantInputDto} from "./create-restaurant-input.dto";

@InputType()
export class UpdateRestaurantInputDto extends PartialType(createRestaurantInputDto) {}
```


Now the problem is that we need to send the id to our resolver to get which row to update. So, we can solve it in 2 ways.
NOTE: If we are using inputtype then our arguments has to have a name like @Args('input') not necessary 'input' it can be anything.
If we are using argsType then @Args() (must be empty)

1st)
```
async update(
   @Args('id') id: number,
   @Args('data') data: UpdateRestaurantDTO
)
{return something}
```
this looks bad as we are using multiple @Args('something') here.
```
mutation{
updateRestaurant({data: {name: "as", value: "rttfd"}, id: 2})
}
```

REMEMBER: If we are using input type then our argument has to have a name. eg..
 ```find(@Args('input_name) temp_name: string) {}```
If we are using argstype then our argument name has to be empty. eg..

```
find(@Args() temp_name: string){}
```

2nd) we are going to unify id and data.
So, we can do like  in updateDTOs and use UpdateUserDTO for updateing,
```
 @InputType()
 export class UpdateUser extends PartialType(AddUser){}

 @InputType()
 export class UpdateUserDTO {
     @Field(() => Number)
     id: number;

     @Field(() => UpdateUser)
     data: UpdateUser;
 }
```



and we use as updateRestaurant( @Args('input') data: UpdateUserDTO ) in our resolver
this results in data transfer via graphQL page as

```
mutation{
  updateRestaurant(input:{
    id: 2,
    data: {
      name: "shekhar"
      isVegan: false,
    }
  })
}
```

OR we can do as

```
@InputType()
export class UpdateUser extends PartialType(AddUser){}

 @ArgsType()
 export class UpdateUserDTO {
     @Field(() => Number)
     id: number;

     @Field(() => UpdateUser)
     data: UpdateUser;
 }
```

and we use as updateRestaurant( @Args() data: UpdateUserDTO ) in our resolver
this results in data transfer via graphQL page as

```
mutation{
  updateRestaurant(
    id: 2,
    data: {
      name: "shekhar"
      isVegan: false,
    }
  )
}
```


Now lets create a function update restaurant in service. So, we are going to use update method of repository.
This function does not check that row is present or not, it just updates it.
If present -> then updated and if not present -> then added.

update takes param to find and then data.
```
update(input_params: updaterestaurantDto) {
   return this.restaurant.update(input_params.id, {...input_params.data})
}
```

Better way is...
```
update({id, data}: updaterestaurantDto) {
   return this.restaurant.update(id, {...data})
}
```
update of repository takes 2 things, 1st is criteria and 2nd is data.
So, we can have any criteria.
eg..
```
update({id, data}: updaterestaurantDto) {
   return this.restaurant.update({name: "lalala"}, {...data})
}
```
this is going to return a promise.
If we forgot to add return type as Promise<boolean> or to return true or false from the function.
We get error as: Cannot return null for non-nullable field Mutation.updateRestaurant


If we want optional types and columns, we can use nullable or default value in field type and IsOptional() and @Column({ default: true }) in entities.
as
Field(type => String, { defaultValue: 'abc' }) or @Field(type => Boolean, { nullable: true })

UpdateRestaurant in our resolver is as--
```
@Mutation(returns => Boolean)
    async updateRestaurant(
        @Args() up: UpdateRestaurantInputDto
    ): Promise<boolean>{
        try{
            await this.restaurantService.updateRestaurant(up);
            return true;
        }
        catch(e){
            return false;
        }
    }
```


--------------------------------- Section 4 -------------------------------------------------------------------------

Let's create our user Module.
`nest g mo users`. This command is going to add usersModule in app.module imports

In our app.module, I am going to delete RestaurantModule (from imports) and delete Restaurant entities (from TypeOrmModule).

Go to users folder and create entities folder and inside that create users.entity.ts

Now our user must have -- 

## User Entity (Model):
-- id
-- createdAt
-- updatedAt
The above 3 fields are going to be common for all entities
-- Email
-- Password
-- role (client | owner | delivery)


type orm entities special columns (it has 4 columns, some of them are date)
        -- @CreateDateColumn() -> it is a special column that automatically sets when we create an entity
        -- @UpdateDateColumn() -> it is a special column that automatically sets when we update an entity
        -- @DeleteDateColumn() -> it is a special column that automatically sets when we delete an entity
        -- @VersionColumn()

Also create a common module as `nest g mo common`. In this module create a folder as entites and in this create core.entity.ts
Inside core.entity.ts put id, createdAt and updatedAt.

And our user.entity.ts is going to extend this core.entity.ts


Our core.entity.ts
```
import {CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class CoreEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
```


Our users.entity.ts 
```
import {Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";

type UserRole = "client" | "owner" | "delivery"

@Entity()
export class User extends CoreEntity{

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;
}
```

Note after this we will get an error as  Query root type must be provided.
This means that we have to create users resolver and add a query in it.

So, do `nest g r users`. Note that by doing this our users resolver is added in providers of users.module.ts
and add query in resolver.

Also, create users.service.ts and don't forget that service needs a repository. So, in import of users.module.ts TypeOrmModule.forFeature([User]),

So, create our users.service as 

```
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user_repository: Repository<User>) {}
}
```

Note: We are using @Injectable() beacuse we are going to inject it in user.resolver and @InjectRepository(User) because we are going to use User repository.
Also note that userService must be in providers of users.module.

Now let's make our user for graphQl also. So, we are going to use @objectType and @field in user.entity.ts and core.entity.ts

Note: we are not making core.entity as @objecttype.

Now, let's start making our createAccount mutation.
So, we need 2 dtos -- 1) CreateAccountInputDto and 2) CreateAccountOutputDto

So, create a file create-account.dto.ts inside dtos inside users as...

```
import {Field, ObjectType, PickType, InputType} from "@nestjs/graphql";
import {User} from "../entities/users.entity";

@InputType()
export class CreateAccountInputDto extends PickType(User, ['email', 'password', 'role']) {}

@ObjectType()
export class CreateAccountOutputDto {
    @Field(type => String, {nullable: true})
    error?: string;
    
    @Field(type => String, {nullable: true})
    message?: string;

    @Field(type => Boolean)
    ok: boolean;
    
}
```

Note: CreateAccountOutputDto is created as objecttype because this is going to be used for output.
for CreateAccountOutputDto, we have 2 options 1 as ArgsType and option 2 as InputType. We are going with InputType because we are going to use mapped type (pick type) for this.


Our user is going to have these features...
## User crud
-- Create account -> how to hash password, verify password
-- Log in   -> authentication, authorization, guards, middlewares, metadata, create our own decorator
-- See Profile
-- Edit Profile
-- Verify Email
-- Unit Testing
-- E2E Testing

Now lets force role in users.entity to have 3 specific values as client or delivery or owner.
For this in user.entity.ts, we are going to create UserRole as enum instead of type.

```
enum UserRole {
Client,
Owner,
Delivery
}
```

So, in the DB we are going to store number as 0, 1 or 2
So, on the @Column decorator of role. We are going to specify type as
```
@Column({type: 'enum', enum: UserRole })
role: UserRole;
```

So, now we are done creating enum for DB. Now, our job is to create enum for graphQl.
So,
`registerEnumType(UserRole, {name: 'UserRole'})`
is added in user.entity.ts as...

```
import {Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";

enum UserRole { "client", "owner" , "delivery" }

registerEnumType(UserRole, {name: 'UserRole'})

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{

    @Column()
    @Field(type => String)
    email: string;

    @Column()
    @Field(type => String)
    password: string;

    @Column({type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    role: UserRole;
}
```

So, in graphQl, now we are having only 3 options for the UserRole. i.e We can only send one of these options for role.


Now, create user-resolver and user service.
Put user service inside of constructor of user resolver (Injecting class users service in resolver).
Put user repository inside the constructor of user service (Injecting user repository in service).

in resolver ->        constructor (private readonly userService: UsersService) {}
Note that users.service needs to be injectable

in service  ->        constructor( @InjectRepository(User) private readonly users: Repository<User> ) {}
Note that Repository(user) must be in typeOrmModule.forFeature() in imports of users.module.

Now create our DTOS for createAccount mutation.
Use ObjectType() and InputType({isAbstract: true}) in user entity.
in use field() in core.entity and user entity.

make createAccount mutation in resolver
and ask for input type dtos. as
createAccount(@Args('input_graphQlname') nameusedhere: booleanfornow)

now make 2 dtos, createAccountInputDTOS and createAccountOutputDTOS
for inputDtos we are going to use pick type -> email password, role
for outputDtos, we are going to make 2 fields, error: string and ok: boolean
Remember, these DTOs are need to be decorated. createAccountInputDTOS with  InputType() and createAccountOutputDTOS with ObjectType()
now update as
createAccount(@Args('input_graphQlname') nameusedhere: createAccountInputDTOS): createAccountOutputDTOS {}

So, for creating user we have to do 3 tasks as...
// check that email does not exists or it is a new user
// if it is a new user, then create a user and hash the password
// if everything goes fine, return ok as true else return error
And these things are to be done in user.service.ts


Our create account in users service
```
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
```

Our create account in users.resolver
```
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
```

Current users.resolver is 
```
import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "./entities/users.entity";
import {UsersService} from "./users.service";
import {CreateAccountInputDto, CreateAccountOutputDto} from "./dtos/create-account.dto";

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
}
```

current users.service is

```
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/users.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {CreateAccountInputDto, CreateAccountOutputDto} from "./dtos/create-account.dto";

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly user_repository: Repository<User>) {}

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
}
```

Note that if we want to return optional value as an object we put -> `Promise<{abc?: string, ok: boolean}>` (in case of promise) OR `abc?: string` or `def?: boolean?`
And if we want to return values as an array but they can be optional -> `Promise<[boolean, string?]>` (in case of promise) OR `[boolean, string?]`
And if we want to return 2 possible options like string or undefined -> `: (string | undefined)`
Also, the way we are going to return it from service, will be the way we are going to accept it in resolver.
eg- if we return as Promise<[boolean, string?]> then we have to accept it as array in resolver.


Now, our target is to hash the password.
To hash the password we are going to use listners and subscribers.
Listners are something that is executed when something happens on your entity (in DB).
eg of listners ->
@AfterLoad()         ->    It is executed after we read a record from DB
@BeforeInsert()      ->    It is executed before we create a record from DB
@AfterInsert()       ->    It is executed after we create a record from DB
@BeforeUpdate()      ->    It is executed before we update a record from DB
@AfterUpdate()       ->    It is executed after we update a record from DB
@BeforeRemove()      ->    It is executed before we delete a record from DB
@AfterRemove()       ->    It is executed after we delete a record from DB

So, to hash the password we are going to use BeforeInsert decorator. and we are creating this in user.entity in user class.

```
@BeforeInsert()
async hashPassword(): Promise<void> {

}
```


And to hash the password we are going to use bcrypt (it is used to do everything with hash),
So install bcypt -> `npm i bcrypt`
and also install types for bcrypt -> `npm i @types/bcrypt --dev-only`
So, in users.entity
```
import {BeforeInsert, Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import * as bcrypt from 'bcrypt';
import {InternalServerErrorException} from "@nestjs/common";

enum UserRole { "client", "owner" , "delivery" }
registerEnumType(UserRole, {name: 'UserRole'})




@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{

   @BeforeInsert()
   async hashPassword()
   {
       try {
           this.password = await bcrypt.hash(this.password, 10);
       }
       catch(e){
           console.log(e);
           throw new InternalServerErrorException();
       }
   }

    @Column()
    @Field(type => String)
    email: string;

    @Column()
    @Field(type => String)
    password: string;

    @Column({type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    role: UserRole;
}
```
So, now why that this.password will work ?
We have used userRepository.create({user data}) in createAccount, and this function creates an instance of user from users.entity.
So, we are going to call this function just before our save method from user repository is called.
So, at this point our instance is created but it is not added into the DB, so, this is referring to the current instance.
Also, as this hashpassword function is in the class of user.entity, this.password is going to refer the current password.



Now it's time to login. So, create in resolver, service, login input DTOS, login outputDTOS.
Note that login outputDTOS, will be having same values as in createAccountOutputDTOS, so put this DTO in common/dtos/core.dto.ts folder.
And let's name the class be -> CoreoutputDto as
```
import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class CoreoutputDto {
    @Field(type => String, {nullable: true})
    error?: string;

    @Field(type => String, {nullable: true})
    message?: string;

    @Field(type => Boolean)
    ok: boolean;
}
```

and now extend this class in createAccountOutputDTOS and in login output dtos.
Also, apart from this our login output must also return a token string.

Our login.dto.ts is as...
```
import {Field, InputType, ObjectType, PickType} from "@nestjs/graphql";
import {CoreoutputDto} from "../../common/dtos/output.dto";
import {User} from "../entities/users.entity";


@ObjectType()
export class LoginOutputDto extends CoreoutputDto {
    @Field(type => String)
    token: string;
}

@InputType()
export class LoginInputDto extends PickType(User, ['email', 'password']) {}
```

Note: we have used @ObjectType() decorator in both child class as well as parent class.

Also, don't forget, if we want to add some validation we can add those validation in user.entity.ts as

```
import {BeforeInsert, Column, Entity} from "typeorm";
import {CoreEntity} from "../../common/entities/core.entity";
import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";
import * as bcrypt from "bcrypt";
import {InternalServerErrorException} from "@nestjs/common";
import {IsEmail, IsEnum, IsString} from "class-validator";

enum UserRole { "client", "owner" , "delivery" }
registerEnumType(UserRole, {name: 'UserRole'})


@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{


    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column()
    @Field(type => String)
    @IsString()
    password: string;

    @Column({type: 'enum', enum: UserRole })
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;
}
```

Now, the task is to create a login feature.
So, for login feature, we need to someway to verify that our password is correct or not.
So, for this, we need to create a checkpassword function in user.entites as... (this function is to be created in the class)

```
async checkPassword(password_currently_entered_by_user: string): Promise<boolean> {
        try{
            const ok = await bcrypt.compare(password_currently_entered_by_user, this.password);
            return ok;
        }
        catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
```




Now, create a login function in users resolver as...

```
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
```


Now, create a login function in users service as...

```
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
            return {ok: true, token: 'lalala'};
        }
        catch(e){
            return {ok: false, error: e};
        }
    }
```


Now, we can test our login as...

```
mutation{
  loginAccount(
    input: {
      email: "sbh@gmai.com",
      password: "12345"
    }
  ){
    ok
    error
    message
    token
  }
}
```

