import { Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { AccountsComponent } from './accounts/accounts.component';

import { HomeComponent } from './home/home.component';
import { MovementsHistoryComponent } from './movements-history/movements-history.component';
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
        /* { title: 'Home', url: '/dashboard-administrator/home' },
        { title: 'Home' } */
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
        { title: 'Home', url: '/dashboard-administrator/staff' },
        { title: 'Home' }
      ]
    }
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    data: {
      pageTitle: '', // Only for dashboards
      title: 'Movement Tracker :: Accounts',
      description: 'Accounts',
      keywords: '',
      ogUrl: 'https://localhost/#/',
      ogTitle: 'Movement Tracker :: Accounts',
      ogDescription: '',
      ogImage: '',
      urls: [
        { title: 'Home', url: '/dashboard-administrator/accounts' },
        { title: 'Home' }
      ]
    }
  },
  {
    path: 'movements-history',
    component: MovementsHistoryComponent,
    data: {
      pageTitle: '', // Only for dashboards
      title: 'Movement Tracker :: Movement History',
      description: 'Movement History',
      keywords: '',
      ogUrl: 'https://localhost/#/',
      ogTitle: 'Movement Tracker :: Movement History',
      ogDescription: '',
      ogImage: '',
      urls: [
        { title: 'Home', url: '/dashboard-administrator/movements-history' },
        { title: 'Home' }
      ]
    }
  },
  {
    path: 'account-details',
    component: AccountDetailsComponent,
    data: {
      pageTitle: '', // Only for dashboards
      title: 'Movement Tracker :: Account details',
      description: 'Movement History',
      keywords: '',
      ogUrl: 'https://localhost/#/',
      ogTitle: 'Movement Tracker :: Account details',
      ogDescription: '',
      ogImage: '',
      urls: [
        { title: 'Home', url: '/dashboard-administrator/account-details' },
        { title: 'Home' }
      ]
    }
  },
];
