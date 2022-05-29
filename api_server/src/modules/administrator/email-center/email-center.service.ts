import { Injectable, Inject } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { ServerResponseDto } from '../../../utils/dto/serverResponseDto';
import { ContactDto } from './dto/contactDto.dto';
//import { Band } from '../../models/band.entity';
//import { EventHall } from '../../models/eventHall.entity';

import { validators } from '../../../utils/validators';
//import { EmailContacts } from '../../models/emailContacts.entity';
import { ResetPassDto } from './dto/resetPassDto.dto';
import { User } from '../../../models/user.entity';
import { ServerMessage } from '../../../classes/ServerMessage.class';

@Injectable()
export class EmailCenterService {
  /* fromEmail = "luismi.luu@gmail.com"; */

  constructor(
    private readonly mailerService: MailerService,

    @Inject('UserRepository') private readonly usersRepository: typeof User,
  ) { }

  async sendWelcomeEmail(newEmail: string, newPassword: string, pdfBase64: string): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        //toEmails = es una variable donde pasas los emails separados por coma
        this.mailerService.sendMail({
          to: newEmail, // list of receivers string separado por comas
          cc: 'api.test.beneficiarios@gmail.com,',
          from: 'sds.ti@chihuahua.gob.mx', // sender address
          subject: "✔ Bienvenido al sistema de archivos",// Subject line
          //text: 'welcome', // plaintext body
          //html: '<b>email : {{email}} . password : {{password}}</b>', /* welcomeEmail,  */ // HTML body content 
          template: "./welcome", // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
          context: {  // Data to be sent to template engine.
            email: newEmail,
            password: newPassword,
          },
          // encoded string as an attachment
          attachments: [
            {
              // encoded string as an attachment
              filename: 'Entrega servicios digitales.pdf',
              path: 'data:application/pdf;base64,' + pdfBase64
            },
          ]
        })
          .then((success) => {
            resolve(new ServerMessage(false, "Email enviado con éxito", success));
          })
          .catch((error) => {
            /* console.log("ERROR ----------------------------------"); */
            console.log(error);
            resolve(new ServerMessage(true, "Error enviando correo", error));
          });
      } catch (error) {
        resolve(new ServerMessage(true, "Error 2 enviando correo", error));
      }
    })
  }

  async sendEmail(to: string, subject: string, template: string, context: {}): Promise<ServerResponseDto> {
    return new Promise(async (resolve, reject) => {
      this.mailerService.sendMail({
        to: to, // list of receivers string separado por comas
        cc: 'api.test.beneficiarios@gmail.com,',
        template: template, // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: context //Data to be sent
      })
        .then((exito) => {
          return resolve(new ServerMessage(false, "Correo enviado con Éxito!", {}))
        })
        .catch((error) => {
          return resolve(new ServerMessage(true, "Ocurrió un fallo el enviar el correo", error))
        });
    });
  }

  async sendChangePasswordEmail(toEmail: string, newPassword: string, name: string): Promise<ServerMessage> {
    return new Promise(async (resolve, reject) => {
      try {
        //toEmails = es una variable donde pasas los emails separados por coma

        this.mailerService.sendMail({
          to: toEmail, // list of receivers string separado por comas
          cc: 'api.test.beneficiarios@gmail.com,',
          subject: "✔ Se a cambiado su contraseña" /* + userName */,// Subject line
          //text: 'welcome', // plaintext body
          //html: '<b>email : {{email}} . password : {{password}}</b>', /* welcomeEmail,  */ // HTML body content 
          template: "./recovery", // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
          context: {  // Data to be sent to template engine.
            name: name,
            email: toEmail,
            newPassword: newPassword,
          },
          // encoded string as an attachment
          /* attachments: [
            {   
              // encoded string as an attachment
              filename: 'acuse-' + data.idRespuestas + '.pdf',
              path: 'data:application/pdf;base64,'+data.pdfBase64
            },
          ] */
        })
          .then((success) => {
            resolve(new ServerMessage(false, "Email enviado con éxito", success));
          })
          .catch((error) => {
            /* console.log("ERROR ----------------------------------"); */
            /* console.log(error); */
            resolve(new ServerMessage(true, "Error enviando correo", error));
          });
      } catch (error) {
        resolve(new ServerMessage(true, "Error 2 enviando correo", error));
      }
    })
  }
  
}
