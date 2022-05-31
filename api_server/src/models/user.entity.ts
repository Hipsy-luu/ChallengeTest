
//import { Sequelize, DataType } from 'sequelize';
import * as bcrypt from 'bcrypt';

import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  BeforeCreate,
  HasMany,
} from 'sequelize-typescript';
import { TeamMember } from './teamMembers.entity';

@Table({
  tableName: 'users',
  //timestamps : true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idUser: number;

  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    comment :  '0 = Super User, 1 = Normal Admin,2 = Normal User'
  })
  idRole: number;

  @Column({
    type: DataType.STRING(45),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    defaultValue : '',
  })
  lastName: string;

  @Column({
    type: DataType.STRING(45),
    allowNull: true,
    defaultValue : '',
  })
  motherLastName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  password: string;
  
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: true,
    defaultValue : 0,
    comment : ''
  })
  englishLevel: number;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    defaultValue : '',
  })
  technicalKnowledge : string;//

  @Column({
    type: DataType.STRING(300),
    allowNull: true,
    defaultValue : '',
  })
  urlCv : string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue : false,
  })
  deleted: boolean;
  
  @CreatedAt
  createdAt : Date;
  
  @UpdatedAt
  updatedAt : Date;

  @HasMany(() => TeamMember, 'idUser')
  teams: TeamMember[];

  @BeforeCreate
  public static async hashPassword( user : User ) {
    // Generate a salt and use it to hash the user's password
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
  }

  public validPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  public async hashNewPassword( password : string ) {
    // Generate a salt and use it to hash the user's password
    return await bcrypt.hash( password, bcrypt.genSaltSync(10));
  }
}