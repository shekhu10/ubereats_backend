import {Inject, Injectable} from '@nestjs/common';
import {CONFIG_OPTIONS} from "../common/common.constants";
import {EmailVariables, MailModuleOptions} from "./mail.interface";
import got from "got";
import * as FormData from 'form-data';

@Injectable()
export class MailService {
    constructor (@Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions) {}

    private async sendEmail(subject: string, toEmail: string, template: string, EmailVars: EmailVariables[]) {
        const form = new FormData();
        form.append('from',`shekhar from uberEats <mailgun@${this.options.domain}>`);
        form.append('to','sbh7435@gmail.com');
        form.append('subject',subject);
        form.append('template',template);
        EmailVars.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));

        try {
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `api:${this.options.apiKey}`
                    ).toString('base64')}`,
                },
                body: form,
            });
        } catch (error){
            console.log(error);
        }
    }


    sendVerificationEmail(email: string, code: string) {
        this.sendEmail("Verify your Email", email, "confirm_email_template", [{key: "code", value: code},
            {key: 'username', value: email}]);
    }
}
