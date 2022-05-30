import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesAdminGuard, RoleSuperAdminGuard } from '../../../middlewares/roles.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('search-users-by-name-email')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  searchUsersByNameEmail(@Body() body): Promise<ServerMessage> {
    return this.accountsService.searchUsersByNameEmail(body);
  } 

  @Get('get-accounts-list')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  getAccounts() : Promise<ServerMessage> {
    return this.accountsService.getAccountsList();
  }

  @Post('create-new-account')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  createAccount(@Body() body): Promise<ServerMessage> {
    return this.accountsService.createAccount(body);
  }  
  
  @Post('update-account')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  updateAccount(@Body() body): Promise<ServerMessage> {
    return this.accountsService.updateAccount(body);
  }
  
  @Get('delete-account/:idAccount')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  deleteAccount( @Param('idAccount') idAccount : number ) : Promise<ServerMessage> {
    return this.accountsService.deleteAccount( idAccount );
  }
}