import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NormalUserRoutes } from './normal-user.routing';

import { AccountDetailsComponent } from './account-details/account-details.component';

@NgModule({
  declarations: [
    //Views - Public
    /* Personalized components */
    
    /* Public Componentes*/

    /* Public views*/
    AccountDetailsComponent,
  ],
  imports: [
    //Imports only for this module
    /* This module has and gives the principal router ability and routes  */
    RouterModule.forChild(NormalUserRoutes),

    CommonModule,
    /* Gives the directives and biding functions in the components */
    
  ],
})
export class NormalUsersModule { }
