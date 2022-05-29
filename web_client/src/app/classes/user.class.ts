import { TeamMember } from "./teams.class";

export class UserDto {
  idUser: number;
  idRole: number;
  name: string;
  lastName: string;
  motherLastName: string;
  email: string;
  englishLevel: number;
  technicalKnowledge : string;
  urlCv : string;
  deleted: boolean;
  createdAt : Date;
  updatedAt : Date;
  
  teams?: TeamMember[];

  constructor() {
    this.idUser = -1;
    this.idRole = -1;
    this.name = '';
    this.lastName = '';
    this.motherLastName = '';
    this.email = '';
    this.englishLevel = -1;
    this.technicalKnowledge = '';
    this.urlCv = '';
    this.deleted = false;
    this.updatedAt = new Date();
    this.createdAt = new Date();
  }
}
