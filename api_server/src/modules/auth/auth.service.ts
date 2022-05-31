import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload.interface';
import { User } from '../../models/user.entity';
import { ServerMessage } from '../../classes/ServerMessage.class';
import { LoginUserDto } from '../../classes/loginUser.class';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        @Inject('UserRepository') private readonly userRepository: typeof User,
    ) { }

    async validateUserByPassword(loginAttempt: LoginUserDto ) : Promise<ServerMessage> {
        return new Promise(async (resolve, reject) => {
            if (
                loginAttempt.email == null ||
                loginAttempt.email == undefined ||
                loginAttempt.password == null ||
                loginAttempt.password == undefined
            ) {
                resolve(new ServerMessage(true, "Invalid request", {}));
            }

            // This will be used for the initial login
            let userToAttempt: User = await this.userRepository.findOne<User>({
                where: {
                    email: loginAttempt.email,
                    deleted: false,
                },
            });

            if (userToAttempt != null) {
                try {
                    // Check the supplied password against the hash stored for this email address
                    let checkPass = await userToAttempt.validPassword(loginAttempt.password);
                    if (checkPass) {
                        // If there is a successful match, generate a JWT for the user
                        let response: any;
                        response = this.createJwtPayload(userToAttempt);

                        let userFormated : User = await this.findOneByEmailAndRole( userToAttempt.email, userToAttempt.idRole);
                        response.user = userFormated;

                        resolve(new ServerMessage(false, "Success sign in", response));
                    } else {
                        //new UnauthorizedException()
                        resolve(new ServerMessage(true, "Wrong username and/or password", new UnauthorizedException()));
                    }
                } catch (error) {
                    resolve(new ServerMessage(true, "Wrong username and/or password", error));
                }
            } else {
                resolve(new ServerMessage(true, "Wrong username and/or password", new UnauthorizedException()));
            }
        });
    }

    createJwtPayload(userDataToAttempt : User) {
        let data: JwtPayload = {
            idUser : userDataToAttempt.idUser,
            email: userDataToAttempt.email,
            idRole : userDataToAttempt.idRole
        };

        // If there is a successful match, generate a JWT for the user
        let jwt = this.jwtService.sign(data);
        return {
            expiresIn: 365 * 24 * 60 * 60,
            token: jwt
        }
    } 
    /* This is used by the strategy for put the user in the request object */
    async validateUserByJwtByEmailAndRole(payload: JwtPayload) {
        // This will be used when the user has already logged in and has a JWT
        let user : User = await this.findOneByEmailAndRole( payload.email, payload.idRole);

        if (user) {
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }

    async findOneByEmailAndRole( email: string,idRole : number  ): Promise<User> {
        return await this.userRepository.findOne<User>({
            attributes : { exclude : ['password']},
            where: {
                email: email,
                idRole : idRole,
                deleted: false,
            },
        });
    }
}