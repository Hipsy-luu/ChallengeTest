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

function sleep(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const databaseProviders = [
  {
    provide: 'SequelizeInstance',
    useFactory: async () => {
      try {
        const sequelize = new Sequelize({
          define: {
            timestamps: false,
          },
          dialect: 'mysql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          logging: false, //If true then SQL querys will be showed in the terminal
          dialectOptions: {
            //useUTC: true, //for reading from database
            //socketPath: '/tmp/mysql.sock', //  Specify the socket file path 
            dateStrings: false,
            typeCast: true,
            //timezone: "America/Chihuahua" //for reading from database
            timezone: "-06:00", //for reading from database
          },
          timezone: "-06:00", //for writing to database
          //timezone: 'America/Chihuahua'//
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
      } catch (error) {
        console.log("Waitting for SQL connection...");


      }
    },
  },
];