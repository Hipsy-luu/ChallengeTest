
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { DatabaseModule } from '../../database/database.module';

import { UserController } from './user/user.controller';

import { UserService } from './user/user.service';

import { userProviders } from '../../models/modelsProviders/user.providers';
import { accountsProviders } from '../../models/modelsProviders/accounts.providers';
import { teamMembersProviders } from '../../models/modelsProviders/teamMembers.providers';
import { AccountsController } from './accounts/accounts.controller';
import { AccountsService } from './accounts/accounts.service';
import { TrackerController } from './tracker/tracker.controller';
import { TrackerService } from './tracker/tracker.service';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ 
      defaultStrategy: 'jwt', 
      session: false 
    }),
  ],
  exports: [],
  controllers: [ 
    UserController , 
    AccountsController ,
    TrackerController ,
  ],
  providers: [
    UserService , 
    AccountsService ,
    TrackerService ,
    ...userProviders,
    ...accountsProviders,
    ...teamMembersProviders,
  ],
})
export class AdministratorModule { }
