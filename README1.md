





--------------------------------- Section 2 -------------------------------------------------------------------------





To talk to our db we can write directly SQL, or we can use type ORM. We can also test our interaction with our DB with TypeORM. TypeORM works on node js and many others. It also works on frontend.
Type ORM supports many DB's (in documentation, in connection-options).

We are going to use it with postgres. so install postgresapp.com (MAC) and then install postico (MAC) or pgAdmin4(windows). postico is to do queries on posgres. Now create your database from postico.
Now in postico, open ubereats db. and run \du; this gives all usernames. and username must be here. Then run ALTER USER shekharbhardwaj WITH PASSWORD '12345';

Now we are going to connect to our DB using nestJS. (we can also use sequelize(it is something like typeORM), or mongoose (for mongo DB)). typeorm is natively made in typescript and sequelize is natively made in javascript. sequelize only works on nodejs and typeORM is used on many platform.
So, now run
npm install --save @nestjs/typeorm typeorm pg (for postgres, if we want for mysql, we use mysql in place of pg)
Now typeORM module is put in imports of app.module. and use forroot() and here we put connection object. (connection object is used to connect to our DB, things like type, username, password).
these options have values like
type: 'postgres',
host: 'localhost',
port: 5432,
username: 'shekharbhardwaj',
password: '12345',
database: 'rvn',
synchronize: true,
logging: true

Note: password is not required when connecting via localhost. username must be the username which is found in \du in postico. port should be number and it is found in server settings. database must be created before adding these lines as we just connect to db and not create it here. synchronize means to run everything and sync it with DB, we do want it while developing but we do not want it while in production. and logging to give logs in our server.

Now we need to put these options in a env file so that we can use it based on environment like test, dev, or prod.
To do this we use ("dotenv") but we do it nestjs way, i.e. configuration module (from documentation), it runs on top of dotenv. So, add configmodule in app.module and use forroot(). But to use ConfigModule we need to install dependency as npm i --save @nestjs/config

options - isGlobal: true,   this means that we are going to use this configuration module from everywhere in our application.
envFilePath:  we are going to use ternary operator to give different env files based on environment.
Eg-   if we use npm run start, I want it to use prod env file,
if we use npm run start:dev, I want it to use dev env file
To set an enviromnent we are going to use npm i cross-env
now edit package.json
in start:dev
we do -> "cross-env NODE_ENV=dev nest start --watch" in place of nest start --watch
now in app.module in configModule, in envFilePath, we can use
process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.prod'
There is 1 more option, ignoreEnvFile. this will be true if we deploy on prod
so process.env.NODE_ENV === 'prod' ? true: false

        to setup environment variables from command line we need to install cross-env as npm i cross-env

So, now transfer all options (ONLY DB CONNECTION) of typeOrm module to dev env. And use process.env.DB_HOST (//ly others). Everything that comes from env, it is in the form of string and port must be number so add a '+' in front of it,
NOTE: In env FILE we use format like DB_name='testdb'

Now we also want to validate the values that we send via env file, we do this in  the configModule options. In the options there is an option validationSchema. So, we want that our application does not start if some of arguments in connection object is missing.

So, to validate we are going to use joi. ->  npm i joi
Joi is a javascript module. javascript modules have a different import way.
like -> import * as Joi from 'joi'; add this line app.module.
if we use import Joi from 'joi'; typescript way. then it is not imported. console.log(Joi) in undefined.
So, validationSchema will get Joi.object({here we validate})
like {NODE_ENV: Joi.string().valid('dev','test','prod').required(), DB_HOST: and so on}
like    validationSchema: Joi.object({NODE_ENV: Joi.string().valid('dev','test','prod').required(), DB_HOST: and so on})



--------------------------------- Section 3 -------------------------------------------------------------------------

Now we are connected to our DB via typeORM. So, now we need to create tables and define their schema. Note we are doing code first approach. And we do @Entity() (like ObjectType)decorator to do this. and @Column() is used in place of @Field() and for primary key we use @PrimaryGeneratedColumn() decorator. there decorators are imported from type orm.
So, we are going to use these decorators in the same entities file.
This is not ging to work because we have created the columns of the table but we have not told typeorm that from where it must take the schema.
So, in TypeOrm module.forroot in app.module. we must add entities: [<entity class name>]

Now how to save data and get data from DB ? Now to interact with DB we are going to use Repository.
there are 2 ways to interact with DB - active mapper and data mapper. Active Mapper is used for small applications.
and we are going to use data mapper. (this is from nest js documentation). (datamapper helps maintaiblity)
with data mapper we first have to import repository and this repository is incharge of to interact with DB.
nest js can automatically can inject repository on classes.

So, now we need to interact with our DB and we need to import Repository in the module. So, we choose Restaurant module (not app.module) because we are going to interact with our restaurant DB in restaurant service and resolvers.
Repository is imported as TypeOrmModule.forfeature([Restaurant]), this restaurant is the entity class.

Now import restaurantservice in our restaurant resolver and the funciton in restaurant resolver is going to return the function of resturant service.
To use restaurant service in restaurant resolver we need to import restaurant service in restaurant resolver.
constructor(private readonly restaurantService: RestaurantService){}
restaurantService must be in providers of restaurant module to be able to inject here in resolver.

To use TypeOrm repository in restaurant service we need to inject restaurant repository in the restaurant service.
constructor(@InjectRepository(Restaurant) private readonly restaurants: Repository<Restaurant> ){}
now we can use this.restaurants.(here we can access all function of the repository). {Restaurant is entity}
All the functions of the repository are async function, so we need to return promise in the function that uses the DB.


Now the task is to create a restaurant.

we are going to create this function in restaurant service
createRestaurant(@Args() create: createRestaurant): boolean {
const newRestaurant = new Restaurant();
newRestaurant.name = createRestaurantDTO.name;
newRestaurant.value = createRestaurantDTO.value;
and then save this newrestaurant into DB.
}
this method sucks as we don't want to do this for every property


    TypeORM has a method create() and this creates a new instance
    So, we can do something like - const newRestaurant = this.<name of repository>.create({name:createRestaurantDTO.name, and so on})
    But because we know that createRestaurantDTO is same as Restaurant (because we made it), we can do like
        const newRestaurant = this.<name of repository>.create(createRestaurantDTO_param_passed_from_resolver);
        So this not currently on DB, so now we need to save this on DB
        return this.restaurants.save(newRestaurant);
    Here createRestaurantDTO will only come if we ask for it as 
            createRestaurant(@Args() createRestaurantDTO: createRestaurantDTO): return_type {} // in resolver
    because we need to ask every argument before using it.


Now we may have a possibility that our createRestaurantDTO is now synced up with entity.
Eg - we make a new field alpha in entity but we forgot to make alpha in createrestaurantDTO.
So, the current problem is that DTO is not synced with entity.

      So, we can either fix this by copy pasting in createRestaurantDTO. 
      The other way is to, something like restaurant entity is going to generate graphQl type (already does this, as we use object type in entites), our DB table (already does this as we used entity decorator) and also our DTO's (we need to do this).
      So to do this we are going to use mapped types.
          There are 4 mapped types -> partial (it makes all fields are optional), pick(it constructs a new class by selecting some fields), omit, intersection
      So, in DTO;s we are going to use something like PartialType or Something else
      like -
            @InputType()
            export class restaurantDTO extends PicKType(Restaurant, ['email']) {}
      we are going to use OmitType.
      Note: this mapped types use InputType. So, we need to have change as per the input type.
      So, in resolver in our createRestaurant function in @Args() we do @Args('input') and change out dto as inputType()
      This is also having an error as the entity that mapped types extend must also be inputType, but in our case it is Object type. So we either convert it to inputtype (and do many more changes) or we convert it to abstract input type as @InputType({isAbstract: true})
      we can also give optional values also. For dto @optional(), for DB @Column({default: true(case of boolean)}), for graphQL. @Field(() => Boolean, {defaultValue: true OR nullable: true}). if we use nullable we won't see default in docs of graphql but it will be default, but in canse of defaultValue we see default value in graphQl docs.


Now make Update a restaurant mutation
we need to create a differentDTO for update. and we will use partial type.
we are going to use partial type on createRestaurant and not on restaurant because Id has to be required.
So, if i do partial type of restaurant then even id will be partial

Now the problem is that we need to send the id to our resolver to get which row to update. So, we can solve it in 2 ways.
NOTE: If we are using inputtype then our arguments has to have a name like @Args('input') not necessary 'input' it can be anything.
If we are using argsType then @Args() (must be empty)
1st)
async update(
@Args('id') id: number,
@Args('data') data: UpdateRestaurantDTO
){return something}
this looks bad as we are using multiple @Args('something') here.
mutation{
updateRestaurant({data: {name: "as", value: "rttfd"}, id: 2})
}


2nd) we are going to unify id and data.
So, we can do like  in updateDTOs and use UpdateUserDTO for updateing,

                @InputType()
                export class UpdateUser extends PartialType(AddUser){}

                @InputType()
                export class UpdateUserDTO {
                    @Field(() => Number)
                    id: number;

                    @Field(() => UpdateUser)
                    data: UpdateUser;
                }

      and we use as updateRestaurant( @Args() data: UpdateUser ) in our resolver
this results in data transfer via graphQL page as

Now lets create a function update restaurant in service. So, we are going to use update method of repository.
This function does not check that row is present or not, it just updates it. if present -> then updated and if not present -> then added.

update takes param to find and then data.
like ->
update({id, data}: updaterestaurantDto) {
return this.restaurant.update(id, {...data})
}
this is going to return a promise.

If we want optional types and columns, we can use nullable or default value in field type and IsOptional() and @Column({ default: true }) in entities.
as
Field(type => String, { defaultValue: 'abc' }) or @Field(type => Boolean, { nullable: true })




--------------------------------- Section 4 -------------------------------------------------------------------------


## User Entity (Model):
-- id
-- createdAt
-- UpdatedAt
The above 3 fields are going to be common for all entities
-- Email
-- Password
-- role (client | owner | delivery)

## User crud
-- Create account -> how to hash password, verify password
-- Log in   -> authentication, authorization, guards, middlewares, metadata, create our own decorator
-- See Profile
-- Edit Profile
-- Verify Email
-- Unit Testing
-- E2E Testing

type orm entities special columns (it has 4 columns, some of them are date)


Now 1st thing is to create User entity for DB. So, (id, createdAt, UpdatedAt), we are going to use this as common in all entities. and (email, password, role) are for User. So, create 2 folders entities and common ,and add user.entity.ts and Core.entity.ts respectively. User.entity.ts is going to extend Core.entity.ts and in core we put common fields.


      in core.entity.ts

                                            export class CoreEntity {
                                                @PrimaryGeneratedColumn()
                                                id: number;
We are not using                                @CreateDateColumn()
@Entity() in core.entity.ts                     createdAt: Date;
As, we will be importing this                   @UpdateDateColumn()
in other entities. and we will                  UpdatedAt: Date;
be using entity decorator there               }

in user.entity we create
type UserRole = "client" | "owner" | "delivery"
and in the class,
@Field(() => string)
role: UserRole;
and also, email and password.

Now, create user-resolver and user service.
Put user service inside of constructor of user resolver (Injecting class service in resolver).
Put user repository inside the constructor of user service (Injecting repository in service).

in resolver ->        constructor (private readonly userService: UsersService) {}
in service  ->        constructor( @InjectRepository(User) private readonly users: Repository<User> ) {}



Now create our DTOS for createAccount mutation.
Use ObjectType() and InputType({isAbstract: true}) in user entity.
in use field() in coreentity and user entity.

make createAccount mutation in resolver
and ask for input type dtos. as
createAccount(@Args('input_graphQlname') nameusedhere: booleanfornow)

now make 2 dtos, createAccountInputDTOS and createAccountOutputDTOS
for inputDtos we are going to use pick type -> email password, role
for outputDtos, we are going to make 2 fields, error: string and ok: boolean
Remember, these DTOs are need to be decorated. createAccountInputDTOS with  InputType() and createAccountOutputDTOS with ObjectType()
now update as
createAccount(@Args('input_graphQlname') nameusedhere: createAccountInputDTOS): createAccountOutputDTOS {}

now, the task is update role. Role currently is string and on graphql we can pass values other than owner, client, delivery also. So, we need to fix that only these 3 values can be passed from graphQl.

To do this we create enum UserRole as
enum UserRole{
Client,
Owner,
Delivery
}

And we also have to register this enum to use it in Field deccorator
registerEnumType(UserRole, {name: 'UserRole' });

to use in column, we are going to do as @Column('int') as enum is going to store as int in DB.

So, we are going to use enum for this. and in @Column we are going to pass type as enum and enum as userRole.



Now, to create a account -
// check if it is new user
// create a user and hash the password
// return ok or error


So in resolver in try and catch block, we can do like this,
const {ok, error} = await this.userservice.createaccount(accountInputdata);
return {ok, error}
// in catch block

In service

        async CreateAccount({email, password, role}: CreateAccountInputDTO): Promise<{ok: boolean, error?: string}> {
                try {
                    const exist = await this.users.findOne({email});
                    if (exist){
                        
                        return {ok: true, error: 'there is a user with this email'};
                    }
                    const new_user = await this.users.create({email, password, role});
                    await this.users.save(new_user);
                    return {ok};
                }
                catch(e){
                    return {ok: false, error: "Couldn't create account"}
                }
            }


      we can also use array to return here, as Promise<[boolean, string?]>
      So, we have to accept it as array in resolver.





Now, our target is to hash the password.
To hash the password we are going to use listners and subscribers.
Listners are something that is executed when something happens on your entity (in DB).
eg of listners -> @AfterLoad(), @BeforeInsert(), @AfterInsert(), @BeforeUpdate(), @AfterUpdate(), @BeforeRemove(), @AfterRemove()
So, to hash the password we are going to use BeforeInsert. and we are creating this in user.entity in user class.
And to hash the password we are going to use bcrypt (it is used to do everything with hash),
So install bcypt -> npm i bcrypt
and also install types for bcrypt -> npm i @types/bcrypt --dev-only

So, in try and catch
this.password = await bcrypt.hash(this.password, 10);
will work as we have used userRepository.create in createAccount. and create only creates account, so this.password will work.


Now it's time to login. So, create in resolver, service, input DTOS, outputDTOS.
Note that outputDTOS, will be having same values as in createAccountOutputDTOS, so put this DTO in common/dtos/core.dto.ts folder.
And let's name the class be -> MutationOutput
and now extend this class in createAccountOutputDTOS.

Now the question is where do we put @ObjectType() in the parent class or the child class ?
Both of them have to be @ObjectTypes(), if not we get an error as "Type CreateAccountOutputDTO must define one or more fields."

Note our outputDTOS are object types and our inputDTOS are inputTypes.
LoginOutputDTO are going to also return token (string) apart from ok and error.

Now, in LoginInputDTO we only need email and password, so we are going to use picktype on user and select email and password.

Now, we also need to add validation in our entities. So, do this in our entites folder in common (if needed) and in User.entity. we use decorators like @IsString() and these are provided in class-validators.

Now let's proceed to create Login login in resolver and service.
So in resolver we are going to use create a mutation, and we are going to return ok, error and token.
if the user is present we return ok and token else we return ok and error.

So, in resolver in try and catch block, we are going to call login function in service. and pass the LoginInputdtos in to service as

          @Mutation(() => loginOutputDTOS)
        async login(@Args('graphQl_name_for_login_data') name_used_here: loginInputDTOS): Promise<loginOutputDTOS> {
            try{
                const {ok, token, error} = await this.userService.login(name_used_here);
                return {ok, error, token};
            }
            catch(error){
                return {
                    ok: false, 
                    error
                };
            }
        }


And in service we are going to do like,


        async login({email, password}: loginInputDTOS): Promise<{ok: boolean, error?: string, token?: string}> {
        // find the user with this email
        // check if the password is correct
        // make a JWT and give it to user.
        try{
            const user = await this.users.findOne({email});
            if (!user){
                return {
                    ok: false,
                    error: "User not found"
                }
            }
            const passwordCorrect = await user.checkPassword(password);
            if (!passwordCorrect){
                return {
                    ok: false,
                    error: "wrong password"
                }
            }
            return {
                ok: true,
                token: "lalal"
            };

        }
        catch(error){
            return {
                ok: false,
                error: error
            }
        }
    }

Note we create checkpassword function in user entity as


    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
          } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
          }
    }

--------------------------------- Section 5 -------------------------------------------------------------------------

Now the time has come to create token login. we can do it in 2 ways
1. We can do it via nest js jwt and passport-jwt.
2. We can do it manually.
   we are going to do it(JWT) manually. we are doing so we want to create module ourselves and use functions like forRoot().
   Doing it this way is important because later we have to sent email to verify account. and then we have to create module.

Now, 1st we need to get token generation working and then we need to put that into the module.
So, to create to token we need to install json web token as npm i jsonwebtoken and we also have to install its types as it do not have have typescript files. So, run npm i @types/jsonwebtoken --only-dev

So, to use jwt, we are going to use sign function of jwt as,
jwt.sign({foo: 'bar'}, privateKey, {algorithm: 'RS256'});  // algorithm is optional
So, this function generates a token. So, when we give the token to the user, we 1st sign it with a private key. And this private key can be given via .env.test file. Remember that this is linked to our project in ConfigModule in app.module
now the token is passed after it is generated by this function. This token contains the {foo: 'bar'} object. This object is visible to everyone. So, user can view the data of the token but user can not update it, if he updates it then token also changes. Note: we shouldn't put sensitive info inside json web token. (we are going to put user id inside it.)
for private key we can use any string -> we are going to go on (google secret key generator) randomkeygen.com and take 256bit key. (take any)
We are going to import jsonwebtoken in user services. import * as Jwt from 'jsonwebtoken'.


        const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET); // because TOKEN_SECRET is provided in env file
    One way is to generate token as shown in aboveline

        But, we want to do it the nestJs way. So, to do that we are going to use configService.
        as TOKEN_SECRET is fetched (or mapped) in ConfigModule in app.module. so we can use config service.
        To be able to use config service in users.service we need to import configModule in the users.module.
        After importing it we are going to inject config service in our user service as

            constructor(
                @InjectRepository(User)
                private readonly users: Repository<User>,
                private readonly configService: ConfigService     // this is for config service.
            ) {}

            So, now we can generate token as,
                const token = jwt.sign({id: user.id}, this.configService.get('TOKEN_SECRET'));
            and return this token if we want the allow user to login.

Note: only by doing configmodule.forroot({}) we have configservice and we can ask for it. and we have asked it in users.service.
Eg token that we got by running login is -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjI4OTExNTkyfQ.q6gyw1J10IChefhhtoHovZVvz-YDfdMDdyX8zPvAkFY

Now, if we go to jwt.io, and paste the token there then we can see the contents inside of token. So, the jwt is not be secret, it's point is to verify that nobody modified them (authenticity)

Now, we are done with the token and now we are going to create our own module for jwt token. (Put what we did for jwt in a different module.)  So,    nest g mo jwt
There are 2 types of modules
1. static module -> eg userModule
2. dynamic module -> it is module that has some configuration on it. eg configModule has a function forroot. we pass configuration inside forRoot() as a object
   dynamic module returns static module.

   we want to do something like
   const token = this.jwt.sign()
   It is something similar to what we already have as configservice.
   So, we want jwt service that is similar to configservice.
   So, we need to create dynamicmodule for it.

So we are going to do -
1.  we are going to create a dynamic module that takes some configuration.
2. then we are going to apply those configuration options.
3. and then we are going to return a static module with the configuration that we wanted.

   For 1) we are going to get dependency injection working. i.e. want forRoot() and import this in service like configservice.

Note: when we hover over forroot of config module we find that it returns a dynamic module and forroot is a static method.
So, go to jwtModule and make a static function forRoot. It can be anything that I want.
static forRoot(): DynamicModule {} or static welcome(): DynamicModule {}
now make jwtservice -> nest g s jwt remove from providers.
remove jwtservice and providers from jwt.module and do this -

        @Module({})
        @Global()
        export class JwtModule {
            static forRoot(): DynamicModule {
                return {
                    module: JwtModule,       // name of module
                    exports: [JwtService],
                    providers: [JwtService],
                }
            }
        }

            
        Now modify our JwtService.
        For testing let's create a function hello in jwt.service and call it user.service.
        we need to inject it in users.service to be able to use it in user.service.

Now, we need to add configuration option in jwt.
to do this, we are going to create a new folder "interfaces" in jwt. and in interfaces create a file "jwt-module-options.interface.ts". in this file we do as
export interface JwtModuleOptions {
privateKey: string;
}
Now in that static forRoot function in jwt.module we do
static forRoot(options: JwtModuleOptions): DynamicModule {...}

    Now we are having an error that options are not provided. So, send options from app.module as

                JwtModule.forRoot({
                    privateKey: process.env.TOKEN_SECRET
                }),
        Now, how do we send option in jwtservice. ? we do this by using provider object.
        So, in jwt.module we are currently using 
                        providers: [JwtService],
        When we look at provider defination ( do it by clicking on providers + command key), we see that provider can be of class provider or value provider or FactoryProvider or ExistingProvider
        
        So, providers: [JwtService] is actually a shortcut for,
                providers[{
                    provide: JwtService,
                    useClass: JwtService
                }]
                because we are using class provider
        
        we can also do it like this (value provider)
                providers[{
                    provide: "BANANA",
                    useValue: "abhc"
                },
                JwtService]   // don't forget we also have to provide jwt.service
        So, now we are having a provider with name BANANA and value abhc.

                providers[{
                    provide: "BANANA",
                    useValue: options
                }, 
                JwtService]
        
        

        Now, we are going to inject BANANA in the jwt.service,
        How are we going to inject it ?
            We are going to do this the same way as we inject in user.services.
    
    constructor(
        @Inject('CONFIG_OPTIONS') private readonly options: JwtModuleOptions,
    ) {console.log(options);}


NOTE: we may get this error --
Nest can't resolve dependencies of the JwtService (?). Please make sure that the argument CONFIG_OPTIONS at index [0] is available in the JwtService context.
Potential solutions:
- If CONFIG_OPTIONS is a provider, is it part of the current JwtService?
- If CONFIG_OPTIONS is exported from a separate @Module, is that module imported within JwtService?
  @Module({
  imports: [ /* the Module containing CONFIG_OPTIONS */ ]
  })

  Then this means that JwtService is being called from somewhere without importing jwtModule. We did this mistake in users.module

Now, rename this BANANA and make it 'CONFIG_OPTIONS' and store this in jwt.constants. and import it from there to use it here. In, JWT.CONSTANTS
-- export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

Now it's time to actually replace that token line in users.service.

Now, we are giving the token to the user, now how are we going to receive the token from the user ?
So, go to user.resolver and make a new query that is going to return user that is currently logged in.
@Query(() => User)
me() {}
So, how we are going to receive the token, we are going to send it in HTTP header. And we are going to create a middle ware which is going to do ---- with this HTTP header.
Middle ware are same as in express ,that they take the request and do something with the request and call the next() funtion.

    Now, create a jwt.middleware.ts in jwt folder. And in here we do - 

            export class JwtMiddleware implements NestMiddleware {
                use(req: Request, res: Response, next: NextFunction) {
                    console.log(req.headers);
                    next();
                }
            }
    NOTE:  NextFunction, Request, Response are from "express";
    
    We can also do a function here as,
        export function jwtMiddleware(req: Request, res: Response, next: NextFunction){
            console.log(req.headers);
            next();
        }



    How to install a middle ware ?
        we can install it on 1 module or we can install it for all the modules (app.module). we are going to do for all modules.

        export class AppModule implements NestModule {
            configure(consumer: MiddlewareConsumer){
                consumer.apply(<here we put the middleware, eg - JwtMiddleware>)<.forRoutes([{<we can give option for which routes we want it>}])>
            }
        }  
                        we checked by seeing the error and then clicking on the words. Like in error we find that configure method must be defined with a consumer. we do that and then clicking on consumer we find that apply method must be defined.
        eg- 
         export class AppModule implements NestModule {
            configure(consumer: MiddlewareConsumer){
                consumer.apply(JwtMiddleware).forRoutes({
                    path: '/graphql',
                    method: RequestMethod.POST,
                });
            }
        }

    For all routes and for all methods we can do as -
        export class AppModule implements NestModule {
            configure(consumer: MiddlewareConsumer){
                consumer.apply(JwtMiddleware).forRoutes({
                    path: '*',
                    method: RequestMethod.ALL,
                });
            }
        }

    There is also a function .exclude({}) in place for forRoutes. same params as forRoutes. This is going to exclude routes from those paths and methods.


INPLACE OF DOING IT TO APP.MODULE, we can also do this in main.ts as
app.use(JwtMiddleware); in our bootstrap function. // it works only when we create middle ware in function.
So, this is kind of difference, if we do it here we are going to use it everywhere, but if we do it in app.module we have more control on where to use middleware and where not to.
Another difference is that nest js allows us dependency injection in the class only and not in function.

We are going to extract the token from header in our jwt middleware

passed from graphQl as
{
"X-JWT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNjI5MDAxNDg4fQ.-QwWQiwCMIE4cCsog6ZGf684M58yhSVFlnOLtc005JY"
}

in jwt.middleware
export class JwtMiddleware implements NestMiddleware {
use(req: Request, res: Response, next: NextFunction) {
if ('x-jwt' in req.headers) {
console.log(req.headers['x-jwt']);
}
next();
}


Now, we need to verify the token, so look for this jsonwebtoken on how to verify the token.
So, we saw 2 functions
1. verify -> it verifies the token and also returns the decripted payload
2. decode -> it do not verifies the token but returns the decripted payload.
   So, we are going to use verify. and we are going to do it in jwt.service as -

   verify(token: string) {
   return jwt.verify(token, this.options.privateKey);
   }
   verify returns a string or an object. So, we need to check what it return.

   Now, the problem is that how to x-jwt will be going from jwt.middleware to jwt.service.
   To do this, we need to use dependency injection. So, mark the class in jwt.middleware as @Injectable() and create a constructor in this class to get the JwtService.

   To check what verify return is what we want we do as -

                @Injectable()
                export class JwtMiddleware implements NestMiddleware {
                    constructor(private readonly jwtService: JwtService) {}
                    use(req: Request, res: Response, next: NextFunction) {
                        if ('x-jwt' in req.headers) {
                            const token = req.headers['x-jwt'];
                            const decoded = this.jwtService.verify(token.toString()); 
                                            // we do it make sure that token is sent in the form of string as verify accepts string as well as object
                            if (typeof decoded === 'object' && decoded.hasOwnProperty('id') ) {
                                console.log([decoded['id']]);
                            }
                                            // we do this typeof because we want our decoded as a payload not as a string. And we need to make sure this is done.
                                            // So, we get the id of the person who send the token. ie. logged in user.
                        }
                        next();
                    }
                }

   Now, we need to look for the user via the user id that we got from the token.
   So, we the user.service we create a function findById(id: number): User {}
   // we will use findOne function of the Repository as -
   async findById(id: number): Promise<User> {
   return this.users.findOne({ id });
   }
   We need to call this function from our jwt-middle ware. So, inject user service in jwt middleware.
   we do it in constructor.


Doing so, it gives an error as

            Potential solutions:
            - If UsersService is a provider, is it part of the current AppModule?
            - If UsersService is exported from a separate @Module, is that module imported within AppModule?
            @Module({
                imports: [ /* the Module containing UsersService */ ]
            })

As the user module is different module than jwt module. So, we are asking for a service that is inside other module. AND THAT OTHER MODULE IS NOT EXPORTING THIS SERVICE
So, to resolve it we need to export user service from user.module as --
exports: [UsersService],  // inside @module({<here>})

Now, we can call the function findById from jwtMiddleware and then we get the user that is logged in.
after getting the user we put the user in the req (in the middleware only, in next line in which we call the findById function) as-
req['user'] = user

    Now the next() will get this updated request.

Now, the task is to give this updated request to our resolvers (in graphQL module). Now we need to remember that graphQL module implements from appolo server. Appolo server has 1 property - context. Context is available for each request. When context is defined as a function it will be called on each request and it will receive an object containing a req property, which represents the request itself. So, context is what we want. This is why we put the user on the request, so that we can share the user to all our resolvers.

So, context is something in which we can put any property and then this will be available for all our resolvers. See documentation for example.

Eg -
in app.module
graphQLModule.forRoot({
context: ({req}) => ({potato: true})
})

    1st middle ware is hit then graphQl module is hit then guards is hit and then resolver is hit by the incomming requeset.

    Now, potato = true will go to all our resolvers.
    here we do context: ({req}) => ({user: req['user]},)
            Don't forget our req already has our user, we now have to put the user in context.

    So, in users.resolver, 
                @Query(() => User)
                me(@Context() context) {
                    console.log(context);
                    <here>
                }

Now, we can see that our user is in the context.

So, now in theory, we can do something like, in <here> 3-4 lines above,

        if(!context.user){
            // user not present
            return <something that signifies no user is present>
        }
        else{
            return context.user;
        }

    This works perfectly fine but the problem is that we do not want to do this on every resolver, this will create duplicate code. So, now the concept of guards come in. (nestjs documentation- guards is like a sheild which is used to stop a request.)

    Now, we need to create a new module authorization
            nest g mo auth
        This module is not important to put in app.module, so remove it from there.
        Now create a file auth.guard.ts
        It is like a function that can choose if we can continue our request or not.
        So, in auth.guard.ts we do,

        @Injectable()
        export class AuthGuard implements CanActivate { } // CanActivate is like a function that if returns true then the request will continue, and if returns false that request will stop. CanActivate interface has only 1 function canActivate and its parameter is ExecutionContext which basically provides access to Context.
        This context is not the context of GraphQL but the context of pipeline (written in comments in the interface CanActivate), basically it is request object. So, now -- 


            @Injectable()
        export class AuthGuard implements CanActivate { 
            canActivate(context: ExecutionContext){
                // console.log(context); // to look the format of context
                // return false;
            }
        }
        To use this guard we are going to do this way --


        @Query(() => boolean)
        @UseGuards(AuthGuard)


    Note: context in canActivate is in HTTP, we need to convert it to graphQl conext.
    we do, it as 
    const gqlContext = GqlExecutionContext.create(context).getContext() // inside canactivate function.
    Now, let's get the user.
    const user = gqlContext['user];
    if (!user) {
        return false;
    }


    Now, we are going to make our decorator so that we can get our user at <here>

    @Query(() => boolean)
    me(<we want user here>) {}

    Here, what we want is to know who is the one who is asking for the query, So, for this we need to create our own decorator. This decorator will behave somewhat like @Args().

So, create a file auth-user.decorator.ts in auth.

    Decorator are easy to create.

    export const <nameOfDecorator> = createParamDecorator(<factoryFunction>)   // it takes a factory function which takes
                                                                     // data: unknown value and context: ExecutionContext

So,
export const AuthUser = createParamDecorator(
(data: unknown, context: ExecutionContext) => {
const gqlContext = GqlExecutionContext.create(context).getContext();
const user = gqlContext['user'];
return user;
}
)

    Note that what we did is similar to auth.guards.
    So, to get the user in resolver we do as----

                        @Query(() => User)
                        @UseGuards(AuthGuard)
                        me(@AuthUser() authUser: User) {
                            console.log(authUser);
                            return authUser;
                        }

            Now, we get our user when we call me, and note: it works only when token is passed in http headers.

    This whole thing can be done using passport easily, doing this way is important as we want to get verificatiion mails in our next section.
    we learnt dynamic module, providers, dependency injection, middleware, guards, decorators, context just for authentication.


So, flow of request is, 1st token is sent on the HTTP headers, then request goes to the middleware, middle ware decrypts the token and verifies it and adds the user to the req object. Than that req object gets put inside graphql context, then our guard finds the graphQl context and looks for the user on the graphQl context if the user is present then it returns true and let's request to pass to resolvers. Now when the request is authorized, we need to get the user object so we create a decorator and decorator looks inside the same graphQl context and return the user.



so, we are going to create 1 query and 1 mutation.
let's go for query 1st. query is profile -> because some times we just need to get the profile of the user.
eg - 1 user wants to get the profile of other user.

let's name the query as user-profile()
So, now we need to make input and output dtos.

            import { ArgsType, Field } from "@nestjs/graphql";
            @ArgsType()
            export class UserProfileInput {
                @Field(type => Number)
                userId: number;
            }

in user.resolver

                @UseGuards(AuthGuard)
                @Query(() => User)
                userProfile(@Args() UserProfileInput: UserProfileInput) {
                    return this.userService.findById(UserProfileInput.userId);
                }

Now let's test it. it gives error - cannot query field "id" and graphQl_validation_failed.
This is because for some reason @ObjectTpye() went missing from core.entites. So, put it there on the top of core.enties class.

(at this point before adding ObjectType decorator on core.entites, I also saw query logs running in the terminal. Like we are running query again and again after 4-5 sec after.)


So, now we can do that
{
userProfile(userId: 2) {
id
email
}
}

Now this do not returns error when we do send wrong id, so we need to take core of that.

So, to resolve this we are going to make userProfileOutputDTOS. So, we are going to return ok, error, data
So, we are going to extend it from mutationOutputDTOS. mutationOutputDTOS already contains error and ok. And now we need 1 more field as user.


        in user-profile.dtos.ts


                            @ObjectType()
                            export class UserProfileOutputDTO extends CoreOutput {
                                @Field(() => User, {nullable: true})
                                user?: User;
                            }

        So, now user.resolver should return UserProfileOutputDTO.

        we update as --- 

                            @UseGuards(AuthGuard)
                            @Query(() => UserProfileOutputDTO)
                            async userProfile(@Args() UserProfileInput: UserProfileInput): Promise<UserProfileOutputDTO> {
                                try{
                                const user = await this.userService.findById(UserProfileInput.userId);
                                if (!user){
                                    throw Error();
                                }
                                return {
                                    ok: true,
                                    user,
                                }
                                }
                                catch(e) {
                                    return {
                                        error: "user not found",
                                        ok: false
                                    }
                                }
                            }

            So, now we do query as


                            {
                                userProfile(userId: 2) {
                                    ok
                                    user
                                    error
                                }
                            }

Now, renaming mutationOutput to CoreOutput // because it looks cooler.

Now it's time to edit or profile
So, create a mutation for it and we need to have DTO's for it as well.
So, create a file edit-profile.dto.ts

        here, we create a class editProfileOutputDTO that extends CoreOutput {} and we make it as ObjectType()

    Now, create a mutation in users.resolver as editProfile. Edit profile will need @authUser{} and editProfileInputDTO

    Now crete a class editProfileInputDTO extends PickType(User, ['email', 'password'])
            // because we allow only email and password to update. Now we also need that some time we update email, sometime password, sometime both so we also need PartialType.
            So, we are ccombining pickType and PartialType
        And we are going to use @inputType() decorator for editProfileInputDTO class.

        Now, in resolver,

                                @UseGuards(AuthGuard)
                                @Mutation(() => editProfileOutputDTO)
                                async editProfile(
                                    @AuthUser() authUser: User, 
                                    @Args('input') editProfileInput: editProfileInputDTO
                                    ): Promise<editProfileOutputDTO> {
                                        // call service function here so 1st create service function
                                }

        Now, go to service,

                         async editProfile(userId: number, { email, password }: editProfileInputDTO) {
                            return this.users.update( { id: userId }, {email, password} );
                         }


        Now, again to resolver,

                            @UseGuards(AuthGuard)
                            @Mutation(() => editProfileOutputDTO)
                            async editProfile(
                                @AuthUser() authUser: User, 
                                @Args('input') editProfileInput: editProfileInputDTO
                                ): Promise<editProfileOutputDTO> {
                                    try {
                                        await this.userService.editProfile(authUser.id, editProfileInput);
                                        return {
                                            ok: true
                                        };

                                    }
                                    catch (error){
                                        return {
                                            ok: false,
                                            error
                                        }
                                    }
                            }

        Note: in the edit profile we are directly running update() [check editProfile in users.service], also we know that update do not checks that the data is present in the DB or not, it just sends an update query which updates if data is present or add it if the data is not present in the DB.
        We are doing this without any concern as the the user id that we are getting is from the cookies (token) and not from graphQL. So, we are making sure that the user is logged in before doing any editProfile mutation.

    Now when we run the mutation from the graphQl page, we get the error as -- "Null value in column \"password\" voilates not-null constraint"

    our mutation from graphql page is --- and we also need to provide token from HTTP headers.
                        mutation (input: {email: "abc@gmail.com"}) {ok, email}

    This means that we are giving the other value as null, So, basically this means that if you want to update email and you pass email from graphQl page and do not pass password, then password will be tried to set to null.

    To undersstand the error,
            look at our editprofileinput in resolver and console.log(input) and look at the result.
            now do console.log(email and password) in editprofile service. 
            we see that password comes as undefined here. And this is because we are using the spread syntax in editprofile service as --  { email, password }: editProfileInputDTO, so if anything is not passed then that will be assigned undefined.
            So, doing this is not the smart thing to do, instead we are going to do---
                        
                        editprofile_name_used_here: editProfileInputDTO
                So, here password = undefined is not present.
                So, we are going to do as --- 

                        async editProfile(userId: number, {editprofile_name_used_here: editProfileInputDTO) {
                            return this.users.update( { id: userId }, {...editprofile_name_used_here} );
                         }
    Note: now we try to update password, then password is not updated as hashed value. So, we need to fix it.
    So, we are going to use @BeforeUpdate() on hashPassword in user.entity to fix this.

            But this is not working. why is not working, why is our beforeInsert hook is not working? This should be working as we are calling update function of TypeOrm in our Editprofile function of users.service.
            The problem is because are calling update from users repository. Update is a very fast and efficient query which do not actually checks that the entry is present in DB or not. So, this means that we are not actually not updating the entry, we are just sending the query to the database and nothing else. And this is not going to trigger beforeinsert. As beforeinsert when we update the entry. Currently, we are just sending the query to the DB and hoping that the query works. If we call update, then hooks are not called.
         
         So, instead we are going to call 'save' method. Save -> saves all the given entities in the DB, if the entities are not present in DB then it will create them otherwise it will update them

         therefore,

                async editProfile(userId: number, {email, password}: editProfileInputDTO): Promise<User> {
                    const user = await this.users.findOne(userId);
                    if (email){
                        user.email = email;
                    }
                    if (password){
                        user.password = password;
                    }
                    return this.users.save(user);
                }

    Now, user can update email at any time, so now we need to verify the email.

async editProfile(userId: number, {email, password}: editProfileInputDTO): Promise<User> {
const user = await this.users.findOne(userId);
if (email){
// here we will be able to verify the email...............
// we will add something that will send the email to the user to verify
user.email = email;
}
if (password){
user.password = password;
}
return this.users.save(user);
}






-------------------------------- Section 6 -------------------------------------------------------------------------
Now, we want to do email verification. We are going to understand database relationships.

We are going to create our email module, it will be a dynamic module as JWT. There is also a nest js community email module.

Now create verification.entity.ts in entities in users.


We are going to do 1-1 relationship. This means that our verification entity can only have 1 user, and a user can only have 1 verification.

eg of 1-many is a restaurant can have many dishes.

Verification.entity.ts is going to have a class verification that extends CoreEntity.
And in this class we are going to have 1 addition field code. Now this code will be used to verify the email.

Now, while defining relationships we need to have a decorator @JoinColumn() and @OneToOne() that is something like foreign key. JoinColumn() is required and it must be set on 1 side of relationship. (typeorm documentation).

Eg- if I want to have a user and from the user I want to get the verifiction that the user had then I have to put @JoinColumn() on the User entity. If I want to get the verification and from the verification I want to access the user then I have to put @JoinColumn() on the verification entity.

In our case we are going to access user from them verification side, So, we want joinColumn on the verification side.


Like ---
import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { string } from "joi";
import { CoreEntity } from "src/common/dtos/core.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { User } from "./user.entity";

                                @InputType({isAbstract: true})
                                @ObjectType()
                                @Entity()
                                export class Verification extends CoreEntity {

                                    @Column()
                                    @Field(() => string)
                                    code: string;

                                    @OneToOne(() => User)
                                    @JoinColumn()
                                    user: User;
                                }


There is no new table in our DB, because we forgot to put verification in typeOrmModule in app.module
We are going to add 1 more field to our User.entity.ts as boolean -> emailVerified. and by default it will be false.

                                @Column({default: false})
                                @Field(() => Boolean)
                                emailVerified: boolean;

Now, we want that when our user create a account, we want to verify email (i.e we want to create verification).
So, for this we need to inject a new repository Verification in users.
So, add it in user module imports. (in forFeature).
Now add in users.service (inside constructor) as ---
@InjectRepository(Verification) private readonly verify: Repository<Verification>
Now, we have a verification repository on user.service

    Now, in user.service in the createAccount, after we save the user we are going to create a verifcation and saving the user in that verification. 

                        async CreateAccount({email, password, role}: CreateAccountInputDTO)
                        : Promise<[boolean, string?]> {
                            try {
                                const exist = await this.users.findOne({email});
                                if (exist){
                                    // return error
                                    return [false, 'there is a user with this email'];
                                }
                                const new_user = await this.users.create({email, password, role});
                                const user = await this.users.save(new_user);
                                await this.verify.save(this.verify.create({user,}));
                                return [true];
                            }
                            catch(e){
                                return [false, "Couldn't create account"]
                            }
                        }
// NOTE - find the difference b/w user and new user in above code by console.log()
Now, we will get the error as we have not created "code": string for the verification. We are going to put code in verification.entity.ts

So, in class verification,

            @BeforeInsert()
            createCode(): void {
                // this.code = "random code"; we can do it using uuid. other way is to convert math.random to string.
                // Math.random().toString(<number between 2 and 36 inclusive this is base>).substring(2)
                // if we want uuid we do npm i uuid. then import it as---
                                    import {v4 as uuid} from 'uuid';
                            and use it as uuidv4();
            }

Note that, now when we createAccount a row in verification is also added.
Now, we have to do the same thing in edit profile.


                await this.verify.save(this.verify.create({user}));  // verify is the instace of verification from constructor in users.service

Now, we have a problem that we are not not deleting any verifications, that means we are not currently verifying the emails.

Now, let's do this. verification is very small thing that we are not going to create a new service for this, we are going to do this in users.module. So, go to user.resolvers.
And create a mutation as

@Mutation(() => <output that we dont have yet.>)

So, go to dtos in users and create a file verify-email.dtos.ts

and make a class VerifyEmailOutputDTO extends CoreOutput{}
and this is ObjectType()

Now create a class VerifyEmailInputDTO extends PickType(Verification, ['code']) {}
and this is InputType()

Note: currently we are getting the error - UnhandledPromiseRejectionWarning: Error: Cannot determine a GraphQL input type for the "code". Make sure your class is decorated with an appropriate decorator.

The problem that we found is that --
@Column()
@Field(() => string)
code: string;
in field decorator we are using small case 'string'. So, make it caps as 'String' and it works fine.

Now let's test --
In graphQL create a new user and lets see that verification is made for it or not ?
It's working.
Now, let's verify email as --



TypeOrm does not load relationships as this is an expensive option for typeOrm. So, we have to tell this explicitely