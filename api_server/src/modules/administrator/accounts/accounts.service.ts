import { ServerMessage } from '../../../classes/ServerMessage.class';
import { User } from '../../../models/user.entity';
import { Injectable, Inject } from '@nestjs/common';
//import { Band } from '../../models/band.entity';
import { Op } from "sequelize";
import { Account } from '../../../models/accounts.entity';
import { TeamMember } from '../../../models/teamMembers.entity';
import { Logger } from 'winston';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    //This is a way to have access to the provider of the table
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('AccountRepository') private readonly accountRepository: typeof Account,
    @Inject('TeamMemberRepository') private readonly teamMemberRepository: typeof TeamMember,
  ) {
  }

  async getAccountsList(): Promise<ServerMessage> {
    try {
      let accountList: any[] = await this.accountRepository.findAll<Account>({
        where: {
          deleted: false,
        },
        order: [
          ['createdAt', 'DESC']
        ],
        /* include : [{
          model : TeamMember,
          as : 'teamMembers',
          where: {
            deleted: false,
          },
          include : [{
            model : User,
            as : 'user',
            attributes : { exclude : ['password']},
            where: {
              deleted: false,
            }
          }]
        }] */
      }).map(async (account: Account) => {
        let accountFix: any = {};

        accountFix = account.toJSON();

        let teamMembers: TeamMember[] = await this.teamMemberRepository.findAll<TeamMember>({
          where: {
            idAccount : account.idAccount,
            deleted: false,
          },
          include : [{
            model : User,
            as : 'user',
            attributes : { exclude : ['password']},
            where: {
              deleted: false,
            }
          }]
        });

        accountFix.teamMembers = teamMembers;

        return accountFix;
      })

      return new ServerMessage(false, 'Success getting the list of accounts', {
        accountList: accountList,
      });
    } catch (error) {
      this.logger.error("Error getting user list : " + error);
      return new ServerMessage(true, 'Error getting user list', error);
    }
  }

  async createAccount(newAccountData: {
    newAccount: Account,
    teamMembers: TeamMember[],
  }): Promise<ServerMessage> {
    try {
      if (
        newAccountData.newAccount == null ||
        newAccountData.newAccount == undefined ||
        newAccountData.newAccount.accountName == null ||
        newAccountData.newAccount.accountName == undefined ||
        newAccountData.newAccount.clientName == null ||
        newAccountData.newAccount.clientName == undefined ||
        newAccountData.newAccount.personInCharge == null ||
        newAccountData.newAccount.personInCharge == undefined ||
        newAccountData.teamMembers == null ||
        newAccountData.teamMembers == undefined
      ) {
        return new ServerMessage(true, "Invalid request", {});
      }

      var newAccount: Account = await this.accountRepository.create<Account>({
        //idAccount: newAccountData.newAccount.idAccount,
        accountName: newAccountData.newAccount.accountName,
        clientName: newAccountData.newAccount.clientName,
        personInCharge: newAccountData.newAccount.personInCharge,
        //deleted: false,
        //createdAt: newAccountData.newAccount.idAccount,
        //updatedAt: newAccountData.newAccount.idAccount,
      });

      for (let index = 0; index < newAccountData.teamMembers.length; index++) {
        const teamMember: TeamMember = newAccountData.teamMembers[index];

        var newTeamMember: TeamMember = await this.teamMemberRepository.create<TeamMember>({
          //idTeamMembers: number,
          idAccount: newAccount.idAccount,
          idUser: teamMember.idUser,
          //deleted: boolean,
          //createdAt : Date,
          //updatedAt : Date,
        });
      }

      return new ServerMessage(false, "Account created successfully.", {
        newAccount: newAccount,
      });
    } catch (error) {
      this.logger.error('An error occurred creating the account : ' + error);
      return new ServerMessage(true, "An error occurred creating the account.", error);
    }
  }

  async deleteAccount(idAccount: number): Promise<ServerMessage> {
    try {
      let accountForUpdate: Account = await this.accountRepository.findOne<Account>({
        where: {
          idAccount: idAccount
        }
      });

      if (!accountForUpdate) {
        return new ServerMessage(true, 'The account is not available', {});
      }

      let membersDeleted : any[] = await this.teamMemberRepository.update<TeamMember>({ 
        deleted : true 
      },{
        where: {
          idAccount: accountForUpdate.idAccount,
        }
      });

      accountForUpdate.deleted = true;
      await accountForUpdate.save();

      return new ServerMessage(false, 'Successfully deleted account.', {membersDeleted});
    } catch (error) {
      this.logger.error('Error deleting account : ' + error);
      return new ServerMessage(true, 'Error deleting account', error);
    }
  }

  async searchUsersByNameEmail(data: { searchValue: string, actualIds: number[] }): Promise<ServerMessage> {
    try {
      if (
        data.searchValue == null ||
        data.searchValue == undefined ||
        data.actualIds == null ||
        data.actualIds == undefined
      ) {
        return new ServerMessage(true, "Invalid request", { data });
      } else if (data.searchValue.length == 0) {
        return new ServerMessage(true, "Invalid request", { data });
      }

      //Validate username and email
      var userList = await this.userRepository.findAll<User>({
        attributes: { exclude: ['password'] },
        where: {
          idUser: {
            [Op.notIn]: data.actualIds
          },
          [Op.or]: [{
            email: {
              [Op.substring]: data.searchValue,
            }
          }, {
            name: {
              [Op.substring]: data.searchValue,
            }
          }, {
            lastName: {
              [Op.substring]: data.searchValue,
            }
          }, {
            motherLastName: {
              [Op.substring]: data.searchValue,
            }
          }],
          deleted: false,
        },
        limit: 4,
      });

      return new ServerMessage(false, "User list fetched successfully.", {
        userList: userList,
      });
    } catch (error) {
      this.logger.error('An error occurred fetched the users : ' + error);
      return new ServerMessage(true, "An error occurred fetched the users.", error);
    }
  }

  async updateAccount(newAccountData : {
    newAccount : Account,
    teamMembers : TeamMember[],
    actualIdsForDelete : number[]
  }): Promise<ServerMessage> {
    try {
      if (
        newAccountData.newAccount == null ||
        newAccountData.newAccount == undefined ||
        newAccountData.newAccount.idAccount == null ||
        newAccountData.newAccount.idAccount == undefined ||
        newAccountData.newAccount.accountName == null ||
        newAccountData.newAccount.accountName == undefined ||
        newAccountData.newAccount.clientName == null ||
        newAccountData.newAccount.clientName == undefined ||
        newAccountData.newAccount.personInCharge == null ||
        newAccountData.newAccount.personInCharge == undefined ||
        newAccountData.teamMembers == null ||
        newAccountData.teamMembers == undefined ||
        newAccountData.actualIdsForDelete == null ||
        newAccountData.actualIdsForDelete == undefined
      ) {
        return new ServerMessage(true, "Invalid request", {});
      }

      let accountForUpdate : Account = await this.accountRepository.findOne<Account>({
        where: {
          idAccount : newAccountData.newAccount.idAccount,
          deleted: false,
        },
      });

      if(!accountForUpdate){
        return new ServerMessage(true, 'Account not available', {});
      }

      //create new members
      for (let index = 0; index < newAccountData.teamMembers.length; index++) {
        const teamMember: TeamMember = newAccountData.teamMembers[index];

        if(teamMember.idTeamMembers == -1){
          var newTeamMember: TeamMember = await this.teamMemberRepository.create<TeamMember>({
            //idTeamMembers: number,
            idAccount: accountForUpdate.idAccount,
            idUser: teamMember.idUser,
            //deleted: boolean,
            //createdAt : Date,
            //updatedAt : Date,
          });
        }
      }

      for (let index = 0; index < newAccountData.actualIdsForDelete.length; index++) {
        const idUserMemberForDelete: number = newAccountData.actualIdsForDelete[index];

        let actualMemberForDelete : TeamMember = await this.teamMemberRepository.findOne<TeamMember>({
          where: {
            idAccount: accountForUpdate.idAccount,
            idUser : idUserMemberForDelete,
            deleted : false
          }
        });

        if(actualMemberForDelete){
          actualMemberForDelete.deleted = true;
          await actualMemberForDelete.save();
        }
      }

      accountForUpdate.accountName = newAccountData.newAccount.accountName;
      accountForUpdate.clientName = newAccountData.newAccount.clientName;
      accountForUpdate.personInCharge = newAccountData.newAccount.personInCharge;
      await accountForUpdate.save();

      return new ServerMessage(false, "Account upgraded successfully", {accountForUpdate});
    } catch (error) {
      this.logger.debug('An error occurred updating the account : ' + error);
      return new ServerMessage(true, "An error occurred updating the account.", error);
    }
  }
}