import {Inject, Injectable} from '@nestjs/common';
import {JwtModuleOptions} from "./jwt.interfaces";
import * as Jwt from "jsonwebtoken";
import {CONFIG_OPTIONS} from "../common/common.constants";

@Injectable()
export class JwtService {
    constructor (@Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions) {}
    sign(payload: object): string{
        const token = Jwt.sign(payload, this.options.privateKey);
        return token;
    }

    verify(token: string){
        return Jwt.verify(token, this.options.privateKey);
    }
}
