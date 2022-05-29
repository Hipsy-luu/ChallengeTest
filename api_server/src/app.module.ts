
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { RouterModule } from '@nestjs/core';

import { AppController } from './app.controller';

import { AuthModule } from './modules/auth/auth.module';
import { AdministratorModule } from './modules/administrator/administrator.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: 
      {
        host: 'smtp.chihuahua.gob.mx',
        from: 'sds.ti@chihuahua.gob.mx',
        tls: {
          rejectUnauthorized: false
        },
        port: 25,
        ignoreTLS: false,
        secure: false,  // upgrade later with STARTTLS
        starttls: {
          enable: false
        },
        //secureConnection: true,
        auth: {
          user: "sds.ti@chihuahua.gob.mx",
          pass: "S5_0ds4T9i",
        },
      },
      defaults: {
        from: 'sds.ti@chihuahua.gob.mx',
      },
      preview: false,
      template: {
        dir: /* process.cwd() */ __dirname + '/templates/emails/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    /* Principal Modules */
    AuthModule,
    AdministratorModule,
    /* Set routes to modules with */
    RouterModule.register([
      {
        path: '',
        module: AuthModule,
      },
      {
        path: 'admin',
        module: AdministratorModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
