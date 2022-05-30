import { TeamMember } from './teams.class';

export class Account {
    idAccount: number;
    accountName: string;
    clientName: string;
    personInCharge: string;
    deleted: boolean;
    createdAt : Date;
    updatedAt : Date;

    teamMembers: TeamMember[];
    
    constructor(){
      this.idAccount = -1
      this.accountName = '';
      this.clientName = '';
      this.personInCharge = '';
      this.deleted = false;
      this.createdAt = new Date();
      this.updatedAt = new Date();

      this.teamMembers = [];
    }
  }