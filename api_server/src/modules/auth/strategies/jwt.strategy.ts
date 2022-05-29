import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from '../interfaces/jwtPayload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'movementsTracker.22-23'
        });
    }

    //If the validation succeeds, the validate() method returns the user record. Otherwise, it returns null
    async validate(payload: JwtPayload){
        let userFixed : any = {}
        userFixed = await this.authService.validateUserByJwtByEmailAndRole(payload);
        
        if(!userFixed){
            throw new UnauthorizedException();
        }
        return userFixed;
    }
}