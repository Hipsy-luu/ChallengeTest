import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
  Sequelize
} from 'sequelize-typescript';
import { Account } from './accounts.entity';
import { User } from './user.entity';

@Table({
  tableName: 'teamMembers',
  //timestamps : false,
})
export class TeamMember extends Model<TeamMember> {
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  idTeamMembers: number;

  @ForeignKey(() => Account)
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
  })
  idAccount: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER({length : 11}),
    allowNull: false,
  })
  idUser: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue : false,
  })
  deleted: boolean;
  
  @UpdatedAt
  updatedAt : Date;

  @CreatedAt
  createdAt : Date;

  @BelongsTo(() => Account, 'idAccount')
  account: Account;

  @BelongsTo(() => User,'idUser')
  user: User;
}