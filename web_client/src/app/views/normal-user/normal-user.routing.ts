import { Routes } from '@angular/router';
import { AccountDetailsComponent } from './account-details/account-details.component';

export const NormalUserRoutes: Routes = [
  
  { path: '', redirectTo: '/dashboard-normal/home', pathMatch: 'full' },
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
        { title: 'Home', url: '/dashboard-normal/account-details' },
        { title: 'Home' }
      ]
    }
  },
];
