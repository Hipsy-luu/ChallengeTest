import { Sequelize } from 'sequelize-typescript';
import { Account } from '../models/accounts.entity';
import { TeamMember } from '../models/teamMembers.entity';

/**
 * SEQUELIZE variable is stored in a file named
 * 'constants' so it can be easily reused anywhere
 * without being subject to human error.
 */
//import { SEQUELIZE } from '../utils/constants';
import { User } from '../models/user.entity';

export const databaseProviders = [
  {
    provide: 'SequelizeInstance',
    useFactory: async () => {
      const sequelize = new Sequelize({
        define: {
          timestamps: false,
        },
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'movementsTrackerUser',
        password: '2hkBtFLGW9Fo4ccW',
        database: 'movementsTracker',
        logging: false, //If true then SQL querys will be showed in the terminal
      });

      /**
       * Add Models Here
       * ===============
       * You can add the models to 
       * Sequelize later on.
       */
      sequelize.addModels([
        User, 
        Account,
        TeamMember,
      ]);

      await sequelize.sync();
      
      return sequelize;
    },
  },
];