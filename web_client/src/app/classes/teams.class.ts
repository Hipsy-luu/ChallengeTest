import { Account } from './account.class';
import { UserDto } from './user.class';

export class TeamMember{
    idTeamMembers: number;
    idAccount: number;
    idUser: number;
    deleted: boolean;
    createdAt : Date;
    updatedAt : Date;

    account?: Account;
    user?: UserDto;

    constructor(){
        this.idTeamMembers = -1;
        this.idAccount = -1;
        this.idUser = -1;
        this.deleted = false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}