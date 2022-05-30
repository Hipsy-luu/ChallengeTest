
import { Module } from '@nestjs/common';

import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';

import { AuthModule } from './modules/auth/auth.module';
import { AdministratorModule } from './modules/administrator/administrator.module';


import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';

@Module({
  imports: [
    /* Principal Modules */
    AuthModule,
    AdministratorModule,
    /* Set routes to modules with */
    RouterModule.register([
      {
        path: '',
        module: AuthModule,
      },
      {
        path: 'admin',
        module: AdministratorModule,
      },
    ]),
    /* Module for log system */

    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        // logger for debugging
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/'),
          filename: 'debug.log',
          level: 'debug',
        }),
        // logger for console errors
        new winston.transports.File({
          dirname: path.join(__dirname, './../log/'),
          filename: 'error.log',
          level: 'error',
        }),
      ],
      format: winston.format.combine(
        winston.format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(
          (info) => `${info.level}: ${[info.timestamp]}: ${info.message}` 
        ),
      )
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
