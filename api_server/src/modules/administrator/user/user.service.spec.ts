import { AuthModule } from './../../auth/auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../../auth/auth.service';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../../../database/database.module';
import { accountsProviders } from '../../../models/modelsProviders/accounts.providers';
import { teamMembersProviders } from '../../../models/modelsProviders/teamMembers.providers';
import { userProviders } from '../../../models/modelsProviders/user.providers';
import { UserController } from './user.controller';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { User } from '../../../models/user.entity';

describe('UserService', () => {
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        WinstonModule.forRoot({
          transports: [
            new winston.transports.Console(),
            // logger for console errors
            new winston.transports.File({
              dirname: __dirname + '/../../../../log/',
              filename: 'error.log',
              level: 'error',
            }),
          ],
        }),
      ],
      exports: [],
      controllers: [],
      providers: [
        UserService , 
        ...userProviders,
        ...accountsProviders,
        ...teamMembersProviders,
      ],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(userService).toBeDefined();
    });

    it('should get all the user list', () => {
      userService.getAllUsers().then((response: ServerMessage) => {
        expect(response.error).toBeFalsy();
      })
    });

    it('should create a new user',async () => {
      let newUserData = {
        idUser: -1,
        idRole: 1,
        name: "test"+Date.now(),
        lastName: "normal",
        motherLastName: "testoito",
        email: Date.now()+"@gmail.com",
        password: "12345678",
        englishLevel: 7,
        technicalKnowledge : "a lot",
        urlCv : "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
        deleted: false,
        createdAt : new Date(),
        updatedAt : new Date()
      };

      let responseResult : ServerMessage = await userService.createUser((newUserData as User));
      
      expect(responseResult.message).toBe('User created successfully.');
    });

    it('should update a user data',async () => {
      let newUserData = {
        idUser: 1,
        idRole: 0,
        name: "test"+Date.now(),
        lastName: "normal",
        motherLastName: "testoito",      
        email: "luismi.luu@gmail.com",
        password: "50YujDBiAF6NNOEx",
        englishLevel: 7,
        technicalKnowledge : "a lot",
        urlCv : "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
      };

      let responseResult : ServerMessage = await userService.editUser((newUserData as User));
      
      expect(responseResult.message).toBe('User upgraded successfully');
    });

    it('should delete a user',async () => {
      let newUserData = {
        idUser: -1,
        idRole: 1,
        name: "test"+Date.now(),
        lastName: "normal",
        motherLastName: "testoito",
        email: Date.now()+"@gmail.com",
        password: "12345678",
        englishLevel: 7,
        technicalKnowledge : "a lot",
        urlCv : "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
        deleted: false,
        createdAt : new Date(),
        updatedAt : new Date()
      };

      let responseResultCreate : ServerMessage = await userService.createUser((newUserData as User));

      let responseDelete : ServerMessage = await userService.deleteUser(responseResultCreate.data.newUser.idUser);
      
      expect(responseDelete.message).toBe('Successfully deleted user.');
    });

    it('should update user password',async () => {
      let newUserData = {
        idUser: -1,
        idRole: 1,
        name: "test"+Date.now(),
        lastName: "normal",
        motherLastName: "testoito",
        email: Date.now()+"@gmail.com",
        password: "12345678",
        englishLevel: 7,
        technicalKnowledge : "a lot",
        urlCv : "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
        deleted: false,
        createdAt : new Date(),
        updatedAt : new Date()
      };
  
      let responseResultCreate : ServerMessage = await userService.createUser((newUserData as User));
  
      let responseDelete : ServerMessage = await userService.resetUserPassByIdUser(
        { idUser: responseResultCreate.data.newUser.idUser, newPassword: "newTest" });
      
      expect(responseDelete.message).toBe('Password updated successfully');
    });
  });
});
