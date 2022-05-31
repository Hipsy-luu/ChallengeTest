import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '../../../database/database.module';
import { accountsProviders } from '../../../models/modelsProviders/accounts.providers';
import { teamMembersProviders } from '../../../models/modelsProviders/teamMembers.providers';
import { userProviders } from '../../../models/modelsProviders/user.providers';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AccountsService } from './accounts.service';
import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Account } from '../../../models/accounts.entity';

describe('AccountsService', () => {
  let accountsService: AccountsService;

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
        AccountsService , 
        ...userProviders,
        ...accountsProviders,
        ...teamMembersProviders,
      ],
    }).compile();

    accountsService = moduleFixture.get<AccountsService>(AccountsService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(accountsService).toBeDefined();
    });

    it('should get all users by name gived and not in []', async () => {

      let response : ServerMessage = await accountsService.searchUsersByNameEmail({ 
        searchValue: 'l', 
        actualIds: [] 
      });

      expect(response.message).toBe("User list fetched successfully.");
    });

    it('should get all accounts list', async () => {
      let response : ServerMessage = await accountsService.getAccountsList();

      expect(response.message).toBe("Success getting the list of accounts");
    });

    it('should create new account', async () => {
      let newAccount = {
        idAccount : -1,
        accountName : "cuenta cliente"+Date.now(),
        clientName : "nombre cliente",
        personInCharge : "acargo test",
        deleted : false,
        createdAt : new Date(),
        updatedAt : new Date(),
      };

      let teamMembers = [];

      let response : ServerMessage = await accountsService.createAccount({
        newAccount: (newAccount as Account),
        teamMembers: teamMembers,
      });

      expect(response.message).toBe("Account created successfully.");
    });

    it('should update gived account data', async () => {
      let newAccount = {
        idAccount : -1,
        accountName : "cuenta cliente "+Date.now(),
        clientName : "nombre cliente",
        personInCharge : "acargo test",
        deleted : false,
        createdAt : new Date(),
        updatedAt : new Date(),
      };

      let teamMembers = [];

      let responseNewAccount : ServerMessage = await accountsService.createAccount({
        newAccount: (newAccount as Account),
        teamMembers: teamMembers,
      });

      let responseUpdateAccount : ServerMessage = await accountsService.updateAccount({
        newAccount: (responseNewAccount.data.newAccount as Account),
        teamMembers: teamMembers,
        actualIdsForDelete : []
      });

      expect(responseUpdateAccount.message).toBe("Account upgraded successfully");
    });

    it('should delete a account by idAccount',async () => {
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
      let newAccount = {
        idAccount : -1,
        accountName : "cuenta cliente "+Date.now(),
        clientName : "nombre cliente",
        personInCharge : "acargo test",
        deleted : false,
        createdAt : new Date(),
        updatedAt : new Date(),
      };

      let teamMembers = [];

      let responseNewAccount : ServerMessage = await accountsService.createAccount({
        newAccount: (newAccount as Account),
        teamMembers: teamMembers,
      });

      let responseDelete : ServerMessage = await accountsService.deleteAccount(responseNewAccount.data.newAccount.idAccount);
      
      expect(responseDelete.message).toBe('Successfully deleted account.');
    });
  });
});
