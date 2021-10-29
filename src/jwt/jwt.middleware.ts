import {Injectable, NestMiddleware} from "@nestjs/common";
import {NextFunction, Request, Response} from "express";
import {JwtService} from "./jwt.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor(private readonly jwtService_here: JwtService,
                private readonly userService_here: UsersService
                ) {
    }
    async use(req: Request, res: Response, next: NextFunction) {
        // console.log(req.headers);
        if ('x-jwt' in req.headers){
            // console.log(req.headers['x-jwt']);
            const token = req.headers['x-jwt'];
            const decoded = this.jwtService_here.verify(token.toString());
            console.log(decoded['id']);
            if (typeof decoded === "object" && decoded.hasOwnProperty('id')){
                try {
                    const user = await this.userService_here.findById(decoded['id']);
                    // console.log(user);
                    req['user'] = user;
                }
                catch(e){}
            }
        }
        next();
    }
}