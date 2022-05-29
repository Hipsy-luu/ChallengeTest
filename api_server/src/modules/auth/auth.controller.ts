import { AuthGuard } from '@nestjs/passport';
import {
    Controller,
    Request,
    Get,
    Post,
    Body,
    UseGuards,
} from '@nestjs/common';

import { LoginUserDto } from '../../classes/loginUser.class';
import { ServerMessage } from '../../classes/ServerMessage.class';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.validateUserByPassword( loginUserDto );
    }

    // This route will require successfully passing our default auth strategy (JWT) in order
    // to access the route
    @Get('validate-token')
    @UseGuards(AuthGuard())
    async formatJwtData(@Request() req) {
        let user = req.user;
        return new ServerMessage(false, 'Success access', {
            user:  await this.authService.findOneByEmailAndRole( user.email, user.idRole ),
        });
    }
}
