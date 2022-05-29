
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { TeamMember } from './teamMembers.entity';

@Table({
  tableName: 'accounts',
  //timestamps : true,
})
export class Account extends Model<Account> {
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idAccount: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  accountName: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  clientName: string;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  personInCharge: string;

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

  @HasMany(() => TeamMember, 'idAccount')
  teamMembers: TeamMember[];
}