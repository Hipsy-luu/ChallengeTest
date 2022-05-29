import { ServerMessage } from '../../../classes/ServerMessage.class';
import { Controller, Request , Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleSuperAdminGuard } from '../../../middlewares/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get-normal-user-list')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
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

  @Post('update-user-password')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  updateUserPassword(@Request() req , @Body() body): Promise<ServerMessage> {
    return this.userService.resetManualUserPassByIdUser( req.user.idUser , body );
  }

  @Post('reset-user-pass')
  @UseGuards( AuthGuard() ,RoleSuperAdminGuard )
  resetUserPassByIdUser( @Body() body/*  @Param('idUser') idUser : number */ ) : Promise<ServerMessage> {
    return this.userService.resetUserPassByIdUser( body );
  }
}