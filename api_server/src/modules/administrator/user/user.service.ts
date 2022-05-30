import { ServerMessage } from '../../../classes/ServerMessage.class';
import { User } from '../../../models/user.entity';
import { Injectable, Inject } from '@nestjs/common';
//import { Band } from '../../models/band.entity';
import { Op } from "sequelize";
import { Account } from '../../../models/accounts.entity';
import { TeamMember } from '../../../models/teamMembers.entity';
import { Logger } from 'winston';

@Injectable()
export class UserService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
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

      this.logger.debug('Super admin created');
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
        order: [
          ['createdAt', 'DESC']
        ]
      }).map(async (user: User) => {
        let userFix: any = {};

        userFix = user.toJSON();

        let actualTeams: TeamMember[] = await this.teamMemberRepository.findAll<TeamMember>({
          where: {
            idUser : user.idUser,
            deleted: false,
          },
          include: [{
            model: Account,
            as: 'account',
            required: true,
            where: {
              deleted: false,
            },
          }]
        });

        userFix.teams = actualTeams;

        return userFix;
      })

      return new ServerMessage(false, 'Success getting the list of users', {
        userList: userList,
      });
    } catch (error) {
      this.logger.error("Error getting user list : " + error);
      return new ServerMessage(true, 'Error getting user list', error);
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
        return new ServerMessage(true, 'Incomplete request', {});
      }

      let userForUpdate: User = await this.userRepository.findOne<User>({
        where: {
          idUser: body.idUser,
          deleted: false,
        }
      });

      if (!userForUpdate) {
        return new ServerMessage(true, 'The user is not available', {});
      }

      userForUpdate.password = await userForUpdate.hashNewPassword(body.newPassword);
      await userForUpdate.save();

      return new ServerMessage(false, 'Password updated successfully', {
        pass: body.newPassword
      });
    } catch (error) {
      this.logger.error('Error updating password : ' + error);
      return new ServerMessage(true, 'Error updating password', error);
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
        return new ServerMessage(true, 'The user is not available', {});
      }

      userForUpdate.deleted = true;
      await userForUpdate.save();

      return new ServerMessage(false, 'Successfully deleted user.', {});
    } catch (error) {
      this.logger.error('Error deleting user : ' + error);
      return new ServerMessage(true, 'Error deleting user', error);
    }
  }

  async createUser(newUserData: User): Promise<ServerMessage> {
    if (
      newUserData.email == null ||
      newUserData.email == undefined ||
      newUserData.englishLevel == null ||
      newUserData.englishLevel == undefined ||
      newUserData.idRole == null ||
      newUserData.idRole == undefined ||
      newUserData.lastName == null ||
      newUserData.lastName == undefined ||
      newUserData.motherLastName == null ||
      newUserData.motherLastName == undefined ||
      newUserData.name == null ||
      newUserData.name == undefined ||
      newUserData.password == null ||
      newUserData.password == undefined ||
      newUserData.technicalKnowledge == null ||
      newUserData.technicalKnowledge == undefined ||
      newUserData.urlCv == null ||
      newUserData.urlCv == undefined
    ) {
      return new ServerMessage(true, "Invalid request", {});
    }

    //Validate username and email
    var userUsernameEmail = await this.userRepository.findOne<User>({
      attributes: ['email'],
      where: {
        [Op.or]: [{
          email: newUserData.email,
        }],
        deleted: false,
      },
    });

    if (userUsernameEmail) {
      return new ServerMessage(true, 'Username currently registered', {});
    }

    try {
      //createUser.idRol = 400;
      var newUser: User = await this.userRepository.create<User>({
        //idUser:  newUserData.idUser ,
        email: newUserData.email.toLowerCase(),
        englishLevel: newUserData.englishLevel,
        idRole: newUserData.idRole,
        lastName: newUserData.lastName.toLowerCase(),
        motherLastName: newUserData.motherLastName.toLowerCase(),
        name: newUserData.name.toLowerCase(),
        password: newUserData.password,
        technicalKnowledge: newUserData.technicalKnowledge,
        urlCv: newUserData.urlCv,
      }, {});

      return new ServerMessage(false, "User created successfully.", {
        newUser: newUser,
      });
    } catch (error) {
      this.logger.error('An error occurred creating the user : ' + error);
      return new ServerMessage(true, "An error occurred creating the user.", error);
    }
  }

  async editUser(newUserData: User): Promise<ServerMessage> {
    try {
      if (
        newUserData.idUser == null ||
        newUserData.idUser == undefined ||
        newUserData.idRole == null ||
        newUserData.idRole == undefined ||
        newUserData.email == null ||
        newUserData.email == undefined ||
        newUserData.englishLevel == null ||
        newUserData.englishLevel == undefined ||
        newUserData.lastName == null ||
        newUserData.lastName == undefined ||
        newUserData.motherLastName == null ||
        newUserData.motherLastName == undefined ||
        newUserData.name == null ||
        newUserData.name == undefined ||
        newUserData.technicalKnowledge == null ||
        newUserData.technicalKnowledge == undefined ||
        newUserData.urlCv == null ||
        newUserData.urlCv == undefined
      ) {
        return new ServerMessage(true, "Incomplete request", {});
      }


      var userForUpdate = await this.userRepository.findOne<User>({
        where: {
          idUser: newUserData.idUser,
          deleted: false,
        },
      });

      if (!userForUpdate) {
        return new ServerMessage(true, 'The user is not available', {});
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
        return new ServerMessage(true, 'Email currently registered', {});
      }

      userForUpdate.email = newUserData.email;
      userForUpdate.lastName = newUserData.lastName.toLowerCase();
      userForUpdate.motherLastName = newUserData.motherLastName.toLowerCase();
      userForUpdate.name = newUserData.name.toLowerCase();
      newUserData.idRole = newUserData.idRole;
      newUserData.englishLevel = newUserData.englishLevel;
      newUserData.technicalKnowledge = newUserData.technicalKnowledge;
      newUserData.urlCv = newUserData.urlCv;

      await userForUpdate.save();

      return new ServerMessage(false, "User upgraded successfully", {});
    } catch (error) {
      this.logger.debug('An error occurred updating the user : ' + error);
      return new ServerMessage(true, "An error occurred updating the user.", error);
    }
  }
}