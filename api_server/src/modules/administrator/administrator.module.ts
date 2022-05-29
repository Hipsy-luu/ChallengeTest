
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../../database/database.module';
import { AuthModule } from '../auth/auth.module';

import { UserController } from './user/user.controller';

import { UserService } from './user/user.service';
import { EmailCenterService } from './email-center/email-center.service';

import { userProviders } from '../../models/modelsProviders/user.providers';
import { accountsProviders } from '../../models/modelsProviders/accounts.providers';
import { teamMembersProviders } from '../../models/modelsProviders/teamMembers.providers';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ 
      defaultStrategy: 'jwt', 
      session: false 
    }),
  ],
  exports: [ 
    UserService , 
    EmailCenterService ,
  ],
  controllers: [ 
    UserController , 
  ],
  providers: [
    EmailCenterService,
    UserService, 
    ...userProviders,
    ...accountsProviders,
    ...teamMembersProviders,
  ],
})
export class AdministratorModule { }
