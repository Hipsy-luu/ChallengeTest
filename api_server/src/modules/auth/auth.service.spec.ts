import { Test, TestingModule } from '@nestjs/testing';
import { LoginUserDto } from '../../classes/loginUser.class';
import { ServerMessage } from '../../classes/ServerMessage.class';
import { userProviders } from '../../models/modelsProviders/user.providers';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
/* import { AppService } from './app.service'; */
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthService', () => {
  let app: INestApplication;

  let authController: AuthController;
  let authService: AuthService;
  let loginData: LoginUserDto = {
    email: "luismi.luu@gmail.com",
    password: "50YujDBiAF6NNOEx",
  };
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ...userProviders,
      ],
      imports: [
        AuthModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    authController = moduleFixture.get<AuthController>(AuthController);

    let userToLOg = await authService.validateUserByPassword(loginData);
    token = userToLOg.data.token;
  });

  describe('AuthService', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });

    it('should do a successful login',async () => {
      let response : ServerMessage = await authService.validateUserByPassword(loginData);
      expect(response.error).toBe(false);
    });
  });

  describe('AuthController', () => {
    it('should be defined', () => {
      expect(authController).toBeDefined();
    });

    it('should extract the user from the JWT /auth/validate-token (GET)', () => {
      return request(app.getHttpServer())
        .get('/auth/validate-token')
        .set({ 
          'Content-Type': 'application/j<son',
          'Authorization': 'Bearer '+token })
        //.send(category)
        .expect(200);
    });
  });
});
