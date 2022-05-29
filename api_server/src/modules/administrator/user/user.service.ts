import { ServerMessage } from '../../../classes/ServerMessage.class';
import { User } from '../../../models/user.entity';
import { Injectable, Inject } from '@nestjs/common';
//import { Band } from '../../models/band.entity';
import { Op } from "sequelize";
import { EmailCenterService } from '../email-center/email-center.service';
import { Account } from '../../../models/accounts.entity';
import { TeamMember } from '../../../models/teamMembers.entity';

@Injectable()
export class UserService {
  constructor(
    private emailCenterService: EmailCenterService,

    //This is a way to have access to the provider of the table
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('AccountRepository') private readonly accountRepository: typeof Account,
    @Inject('TeamMemberRepository') private readonly teamMemberRepository: typeof TeamMember,
  ) {
    this.createAdmin();
  }

  async createAdmin() {
    let actualAdmin = await this.userRepository.findOne({
      where: {
        email: 'luismi.luu@gmail.com',
        deleted: false,
        idRole: 0,
      }
    });

    if (!actualAdmin) {
      let adminUser = await this.userRepository.create<User>({
        //idUser: number,
        idRole: 0,
        name: "Luismiguel",
        lastName: "Ortiz",
        motherLastName: "Alvárez",
        email: "luismi.luu@gmail.com",
        password: "50YujDBiAF6NNOEx",
        englishLevel: 7,
        technicalKnowledge: "Full Stack",
        urlCv: "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
        deleted: false,
        //createdAt : Date,
        //updatedAt : Date
      });
    }
  }

  async findOneByEmail(useremail: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: {
        email: useremail,
        deleted: false,
      }
    });
  }

  async getAllUsers(): Promise<ServerMessage> {
    try {
      let userList: any[] = await this.userRepository.findAll<User>({
        attributes: { exclude: ['password'] },
        where: {
          deleted: false,
        },
      }).map(async (user : User)=>{
        let userFix : any = {};

        userFix = user.toJSON();

        let actualTeams : TeamMember[]= await this.teamMemberRepository.findAll<TeamMember>({
          attributes: { exclude: ['password'] },
          where: {
            deleted: false,
          },
          include: [{
            model: Account,
            as: 'account',
            required : true,
            where: {
              deleted: false,
            },
          }]
        });
        
        userFix.teams = actualTeams;
    
        return userFix;
      })

      return new ServerMessage(false, 'Éxito obteniendo la lista de usuarios', {
        userList: userList,
      });
    } catch (error) {
      return new ServerMessage(true, 'Error obteniendo la lista de usuarios', error);
    }
  }

  async resetManualUserPassByIdUser(idUser: number, data): Promise<ServerMessage> {
    try {
      if (
        data.password == null ||
        data.password == undefined
      ) {
        return new ServerMessage(true, "Petición incompleta", {});
      }

      let userForUpdate: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser,
          deleted: false,
        }
      });

      if (!userForUpdate) {
        return new ServerMessage(true, 'El usuario no esta disponible', {});
      }

      userForUpdate.password = await userForUpdate.hashNewPassword(data.password);
      await userForUpdate.save();
      //return new ServerMessage(false, 'Contraseña actualizada con éxito, la contraseña no se pudo enviar al correo', { pass : data.password});
      let resultEmail =
        await this.emailCenterService.sendChangePasswordEmail(
          userForUpdate.email,
          data.password,
          userForUpdate.name.toUpperCase() + " " + userForUpdate.lastName.toUpperCase() + " " + userForUpdate.motherLastName.toUpperCase()
        );

      //console.log("siguio");
      //console.log(resultEmail);

      if (resultEmail.error == true) {
        return new ServerMessage(false, 'Contraseña actualizada con éxito, la contraseña no se pudo enviar al correo', { error: resultEmail, pass: data.password });
      } else {
        return new ServerMessage(false, 'Contraseña actualizada con éxito se a enviado la contraseña al correo indicado', { error: resultEmail, pass: data.password });
      }
    } catch (error) {
      return new ServerMessage(true, 'Error obteniendo la lista de usuarios normales', error);
    }
  }

  async resetUserPassByIdUser(body: { idUser: number, newPassword: string }): Promise<ServerMessage> {
    try {
      if (
        body.idUser == null ||
        body.idUser == undefined ||
        body.newPassword == null ||
        body.newPassword == undefined
      ) {
        return new ServerMessage(true, 'Petición incompleta', {});
      }

      let userForUpdate: User = await this.userRepository.findOne<User>({
        where: {
          idUser: body.idUser,
          deleted: false,
        }
      });

      if (!userForUpdate) {
        return new ServerMessage(true, 'El usuario no esta disponible', {});
      }

      /* var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      } */

      userForUpdate.password = await userForUpdate.hashNewPassword(body.newPassword);
      await userForUpdate.save();

      let resultEmail =
        await this.emailCenterService.sendChangePasswordEmail(
          userForUpdate.email,
          body.newPassword,
          userForUpdate.name.toUpperCase() + " " + userForUpdate.lastName.toUpperCase() + " " + userForUpdate.motherLastName.toUpperCase()
        );

      //console.log("siguio");
      //console.log(resultEmail);

      if (resultEmail.error == true) {
        return new ServerMessage(false, 'Contraseña actualizada con éxito, la contraseña no se pudo enviar al correo', { error: resultEmail, pass: body.newPassword });
      } else {
        return new ServerMessage(false, 'Contraseña actualizada con éxito se a enviado la contraseña al correo indicado', { error: resultEmail, pass: body.newPassword });
      }
    } catch (error) {
      return new ServerMessage(true, 'Error obteniendo la lista de usuarios normales', error);
    }
  }


  async deleteUser(idUser: number): Promise<ServerMessage> {
    try {
      let userForUpdate: User = await this.userRepository.findOne<User>({
        where: {
          idUser: idUser
        }
      });

      if (!userForUpdate) {
        return new ServerMessage(true, 'El usuario no esta disponible', {});
      }

      userForUpdate.deleted = true;
      await userForUpdate.save();

      return new ServerMessage(false, 'Usuario eliminado con éxito.', {});
    } catch (error) {
      return new ServerMessage(true, 'Error eliminando el usuario', error);
    }
  }

  async createUser(newUserData): Promise<ServerMessage> {
    if (
      newUserData.deleted == null ||
      newUserData.deleted == undefined ||
      newUserData.email == null ||
      newUserData.email == undefined ||
      newUserData.gender == null ||
      newUserData.gender == undefined ||
      newUserData.idDepartment == null ||
      newUserData.idDepartment == undefined ||
      newUserData.lastName == null ||
      newUserData.lastName == undefined ||
      newUserData.motherLastName == null ||
      newUserData.motherLastName == undefined ||
      newUserData.name == null ||
      newUserData.name == undefined ||
      newUserData.observations == null ||
      newUserData.observations == undefined ||
      newUserData.password == null ||
      newUserData.password == undefined ||
      newUserData.pdfBase64 == null ||
      newUserData.pdfBase64 == undefined ||
      newUserData.photo == null ||
      newUserData.photo == undefined ||
      newUserData.position == null ||
      newUserData.position == undefined
    ) {
      return new ServerMessage(true, "Petición incompleta", { newUserData });
    }

    //Validate username and email
    var userUsernameEmail = await this.userRepository.findOne<User>({
      attributes: ['email'],
      where: {
        [Op.or]: [{
          email: newUserData.email,
        }/* ,{
          username : newUserData.username,
        } */],
        deleted: false,
      },
    });

    if (userUsernameEmail) {
      return new ServerMessage(true, 'Nombre de usuario actualmente registrado', {});
    }

    try {
      //createUser.idRol = 400;
      var newUser: User = await this.userRepository.create<User>({
        //idUser:  newUserData.idUser ,
        idDepartment: newUserData.idDepartment,
        email: newUserData.email,
        gender: newUserData.gender,
        lastName: newUserData.lastName,
        motherLastName: newUserData.motherLastName,
        name: newUserData.name,
        observations: newUserData.observations,
        password: newUserData.password,
        photo: false,
        position: newUserData.position,
      }, {});

      let sendWelcomeEmailResult: ServerMessage =
        await this.emailCenterService.sendWelcomeEmail(newUserData.email, newUserData.password, newUserData.pdfBase64);

      if (sendWelcomeEmailResult.error == false) {
        return new ServerMessage(false, "Usuario creado con éxito, se a enviado un correo electrónico con su información.", {});
      } else if (sendWelcomeEmailResult.error == true) {
        return new ServerMessage(false, "Usuario creado con éxito, no se envió la bienvenida.", { newUser: {}, error: sendWelcomeEmailResult });
      }
      //return new ServerMessage(false,"Usuario creado con éxito, no se envió la bienvenida.", newUser );
    } catch (error) {
      //console.log(error);
      return new ServerMessage(true, "A ocurrido un error creando el usuario.", error);
    }
  }

  async editUser(newUserData: User): Promise<ServerMessage> {
    if (
      newUserData.idUser == null ||
      newUserData.idUser == undefined ||
      newUserData.deleted == null ||
      newUserData.deleted == undefined ||
      newUserData.email == null ||
      newUserData.email == undefined ||
      newUserData.lastName == null ||
      newUserData.lastName == undefined ||
      newUserData.motherLastName == null ||
      newUserData.motherLastName == undefined ||
      newUserData.name == null ||
      newUserData.name == undefined
    ) {
      return new ServerMessage(true, "Petición incompleta", {});
    }

    var userForUpdate = await this.userRepository.findOne<User>({
      where: {
        idUser: newUserData.idUser,
        deleted: false,
      },
    });

    if (!userForUpdate) {
      return new ServerMessage(true, 'El usuario no esta disponible', {});
    }

    //Validate username and email
    var userUsernameEmail: User = await this.userRepository.findOne<User>({
      attributes: ['idUser', 'email'],
      where: {
        idUser: {
          [Op.not]: newUserData.idUser,
        },
        email: newUserData.email,
        deleted: false,
      },
    });

    if (userUsernameEmail) {
      return new ServerMessage(true, 'Email actualmente registrado', {});
    }

    try {
      userForUpdate.email = newUserData.email;
      userForUpdate.lastName = newUserData.lastName;
      userForUpdate.motherLastName = newUserData.motherLastName;
      userForUpdate.name = newUserData.name;

      await userForUpdate.save();

      return new ServerMessage(false, "Usuario actualizado con éxito", {});
    } catch (error) {
      //console.log(error);
      return new ServerMessage(true, "A ocurrido un error actualizando el usuario.", error);
    }
  }
}