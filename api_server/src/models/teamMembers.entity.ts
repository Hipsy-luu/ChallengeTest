import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { Account } from './accounts.entity';
import { User } from './user.entity';

@Table({
  tableName: 'teamMembers',
  //timestamps : true,
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
  
  @CreatedAt
  createdAt : Date;
  
  @UpdatedAt
  updatedAt : Date;

  @BelongsTo(() => Account, 'idAccount')
  account: Account;

  @BelongsTo(() => User,'idUser')
  user: User;
}