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

function sleep(ms : number) : Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export const databaseProviders = [
  {
    provide: 'SequelizeInstance',
    useFactory: async () => {
      let tryConnections = 0;
      let connectionError = {};
      for (let index = 0; index < 10; index++) {
        try {
          const sequelize = new Sequelize({
            define: {
              timestamps: false,
            },
            dialect: 'mysql',
            //'mysqldb-app' = name of the container in the networl
            //'localhost'=127.0.0.1= For local develoment
            host: 'localhost',
            port: 3306,
            username: 'movementsTrackerUser',
            password: '2hkBtFLGW9Fo4ccW',
            database: 'movementsTracker',
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
          index = 10;
          return sequelize;
        } catch (error) {
          console.log("Try number "+(index+1)+" to conecto to te database");
          await sleep(5000)
          connectionError = error;
        }
      }
      console.log("Limit of try to connect to the database reached");
    },
  },
];