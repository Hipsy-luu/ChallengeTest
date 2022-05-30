import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Controller, Request , Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesAdminGuard, RoleSuperAdminGuard } from '../../../middlewares/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-normal-user-list')
  @UseGuards( AuthGuard() ,RolesAdminGuard )
  getUsers() : Promise<ServerMessage> {
    return this.userService.getAllUsers();
  }

  @Post('create-new-user')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  createUser(@Body() body): Promise<ServerMessage> {
    return this.userService.createUser(body);
  }  
  
  @Post('edit-user')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  editUser(@Body() body): Promise<ServerMessage> {
    return this.userService.editUser(body);
  }
  
  @Get('delete-user/:idUser')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  deleteUser( @Param('idUser') idUser : number ) : Promise<ServerMessage> {
    return this.userService.deleteUser( idUser );
  }

  @Post('reset-user-pass')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  resetUserPassByIdUser( @Body() body ) : Promise<ServerMessage> {
    return this.userService.resetUserPassByIdUser( body );
  }
}