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
