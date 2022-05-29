import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { StaffComponent } from './staff/staff.component';

export const AdministratorRoutes: Routes = [
  { path: '', redirectTo: '/dashboard-administrator/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    data: {
      pageTitle: '', // Only for dashboards
      title: 'Movement Tracker :: Home',
      description: 'Welcome to Movement Tracker',
      keywords: '',
      ogUrl: 'https://localhost/#/',
      ogTitle: 'Movement Tracker :: Home',
      ogDescription: '',
      ogImage: '',
      urls: [
        /* { title: 'Inicio', url: '/dashboard-administrator/home' },
        { title: 'Inicio' } */
      ]
    }
  },
  {
    path: 'staff',
    component: StaffComponent,
    data: {
      pageTitle: '', // Only for dashboards
      title: 'Movement Tracker :: Registered staff',
      description: 'Registered staff',
      keywords: '',
      ogUrl: 'https://localhost/#/',
      ogTitle: 'Movement Tracker :: Registered staff',
      ogDescription: '',
      ogImage: '',
      urls: [
        /* { title: 'Inicio', url: '/dashboard-administrator/staff' },
        { title: 'Inicio' } */
      ]
    }
  },
];
