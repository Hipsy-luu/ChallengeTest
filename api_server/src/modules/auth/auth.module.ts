import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { userProviders } from '../../models/modelsProviders/user.providers';
import { AuthController } from './auth.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      privateKey: 'movementsTracker.22-23',
      signOptions: {
        expiresIn: 365 * 24 * 60 * 60
      }
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService ,
    JwtStrategy ,
    ...userProviders,
  ],
  exports: [
    AuthService ,
  ]
})
export class AuthModule {}