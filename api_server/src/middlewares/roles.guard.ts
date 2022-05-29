import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
//0  Super Administrator
//1  Administrador
//2  Normal User

@Injectable()
export class RoleSuperAdminGuard implements CanActivate {
  constructor(/* private reflector: Reflector */) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole : number = request.user.idRole;

    return  userRole == 0 ? true : false;
  }
}