import { ServerMessage } from '../../../classes/ServerMessage.class';
import { User } from '../../../models/user.entity';
import { Injectable, Inject } from '@nestjs/common';
//import { Band } from '../../models/band.entity';
import { Op } from "sequelize";
import { Account } from '../../../models/accounts.entity';
import { TeamMember } from '../../../models/teamMembers.entity';
import { Logger } from 'winston';

@Injectable()
export class TrackerService {
  constructor(
    @Inject('winston') private readonly logger: Logger,
    //This is a way to have access to the provider of the table
    @Inject('UserRepository') private readonly userRepository: typeof User,
    @Inject('AccountRepository') private readonly accountRepository: typeof Account,
    @Inject('TeamMemberRepository') private readonly teamMemberRepository: typeof TeamMember,
  ) {
  }
  createDateAsUTC(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
  }
  convertDateToUTC(date: Date) {
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  }

  async getMovementsHistory(idUser: number,
    dataToSearch: {
      fromDate: any,
      toDate: any,
      isCreatedAt: boolean,
      search: string,
    }): Promise<ServerMessage> {
    try {
      if (
        idUser == null ||
        idUser == undefined ||
        dataToSearch.fromDate == null ||
        dataToSearch.fromDate == undefined ||
        dataToSearch.toDate == null ||
        dataToSearch.toDate == undefined ||
        dataToSearch.isCreatedAt == null ||
        dataToSearch.isCreatedAt == undefined ||
        dataToSearch.search == null ||
        dataToSearch.search == undefined
      ) {
        return new ServerMessage(true, "Incomplete request", {});
      }

      dataToSearch.fromDate = new Date(dataToSearch.fromDate).toLocaleDateString("en-US", {
        year: "2-digit",month: "2-digit",day: "2-digit" ,
        hour: '2-digit', minute:'2-digit', 
        timeZone: 'America/Chihuahua' ,
        localeMatcher : 'best fit'});

      dataToSearch.toDate = new Date(dataToSearch.toDate).toLocaleDateString("en-US", {
        year: "2-digit",month: "2-digit",day: "2-digit" ,
        hour: '2-digit', minute:'2-digit', 
        timeZone: 'America/Chihuahua' ,
        localeMatcher : 'best fit'});

      let query = {};

      if (dataToSearch.isCreatedAt == true) {
        query = {
          where: {
            [Op.or]: [
              {
                createdAt: {
                  [Op.between]: [new Date(dataToSearch.fromDate), new Date(dataToSearch.toDate)]
                }
              }, {
                createdAt: new Date(dataToSearch.fromDate)
              }, {
                createdAt: new Date(dataToSearch.toDate)
              }]
          },
          include: [{
            attributes: { exclude : ['password']},
            model : User,
            as : 'user',
            where: {
              [Op.or]: [
                {
                  email: {
                    [Op.substring]: dataToSearch.search,
                  }
                }, {
                  name: {
                    [Op.substring]: dataToSearch.search
                  }
                }, {
                  lastName: {
                    [Op.substring]: dataToSearch.search,
                  }
                }, {
                  motherLastName: {
                    [Op.substring]: dataToSearch.search,
                  }
                }]
            }
          },{
            model : Account,
            as : 'account'
          }],
          order: [
            ['createdAt', 'DESC'],
          ],
        };
      } else {
        query = {
          where: {
            [Op.and]: [{ 
              [Op.or]: [
                {
                  updatedAt: {
                    [Op.between]: [new Date(dataToSearch.fromDate), new Date(dataToSearch.toDate)]
                  }
                }, {
                  updatedAt: new Date(dataToSearch.fromDate)
                }, {
                  updatedAt: new Date(dataToSearch.toDate)
                }]
            }], 
          },
          include: [{
            attributes: { exclude : ['password']},
            model : User,
            as : 'user',
            where: {
              [Op.or]: [
                {
                  email: {
                    [Op.substring]: dataToSearch.search,
                  }
                }, {
                  name: {
                    [Op.substring]: dataToSearch.search
                  }
                }, {
                  lastName: {
                    [Op.substring]: dataToSearch.search,
                  }
                }, {
                  motherLastName: {
                    [Op.substring]: dataToSearch.search,
                  }
                }]
            }
          },{
            model : Account,
            as : 'account'
          }],
          order: [
            ['updatedAt', 'DESC'],
          ],
        };
      }
      let membersHistoryList: TeamMember[] = await this.teamMemberRepository.findAll<TeamMember>(query);

      return new ServerMessage(false, 'Obtained history view data', {
        membersHistoryList: membersHistoryList
      });
    } catch (error) {
      this.logger.error('Error getting history view data : '+ error);
      return new ServerMessage(true, 'Error getting history view data', error);
    }
  }
}