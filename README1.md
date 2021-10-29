

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
