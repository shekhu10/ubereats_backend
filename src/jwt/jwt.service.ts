import {Inject, Injectable} from '@nestjs/common';
import {JwtModuleOptions} from "./jwt.interfaces";
import {CONFIG_OPTIONS} from "./jwt.constants";
import * as Jwt from "jsonwebtoken";

@Injectable()
export class JwtService {
    constructor (@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {
        console.log(options);
    }
    sign(payload: object): string{
        const token = Jwt.sign(payload, this.options.privateKey);
        return token;
    }

    verify(token: string){
        return Jwt.verify(token, this.options.privateKey);
    }
}
