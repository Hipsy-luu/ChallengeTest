import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Layouts */
import { BlankComponent } from './layouts/blank/blank.component';
import { FullAdministratorUserComponent } from './layouts/full-administrator-user/full-administrator-user.component';
/* Views */

const routes: Routes = [
  { path: '', redirectTo: '/login'/* '/landing-page' */, pathMatch: 'full' },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: '',
        //Se carga de esta manera porque dentro del modulo del dashboard vienen componentes e importaciones que
        //se comparten y pueden usar en las vistas dentro del modulo
        loadChildren: () => import('./views/public/public.module').then(m => m.PublicModule)
      },
    ]
  },
  {
    path: '',
    component: FullAdministratorUserComponent,
    children: [
      {
        path: 'dashboard-administrator',
        //Se carga de esta manera porque dentro del modulo del dashboard vienen componentes e importaciones que
        //se comparten y pueden usar en las vistas dentro del modulo
        loadChildren: () => import('./views/administrator/administrator.module').then(m => m.AdministratorModule)
      },
    ]
  },
  //In case the router dont find the url
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    {
      useHash: false,
      scrollPositionRestoration: 'enabled'
    }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
