import { NotfoundComponent } from './404/not-found.component';
import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

export const PublicRoutes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          pageTitle: '', // Only for dashboards
          title: 'Movement Tracker :: Login',
          description: 'Login',
          keywords: '',
          ogUrl: 'https://localhost.com/#/',
          ogTitle: 'Movement Tracker :: Login',
          ogDescription: '',
          ogImage: '',
          urls: [

          ]
        }
      },
      {
        path: '404',
        component: NotfoundComponent
      },
    ]
  }
];
