import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { AdministratorRoutes } from './administrator.routing';
//Home
import { HomeComponent } from './home/home.component';
import { ComponentsModule } from '../../components/components.component';

import { MaterialModule } from '../../utils/material';
import { StaffComponent } from './staff/staff.component';
import { AccountsComponent } from './accounts/accounts.component';
import { MovementsHistoryComponent } from './movements-history/movements-history.component';
import { DatetimerangepickerModule } from 'angular-datetimerangepicker';
import { AccountDetailsComponent } from './account-details/account-details.component';

@NgModule({
  declarations: [
    //Views - Public
    /* Personalized components */
    
    /* Public Componentes*/

    /* Public views*/
    HomeComponent,
    StaffComponent,
    AccountsComponent,
    MovementsHistoryComponent,
    AccountDetailsComponent,
  ],
  imports: [
    //Imports only for this module
    /* This module has and gives the principal router ability and routes  */
    RouterModule.forChild(AdministratorRoutes),

    CommonModule,
    /* Gives the directives and biding functions in the components */
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    /* Owl carrousel */
    PerfectScrollbarModule,
    CarouselModule,
    NgbModule,
    MaterialModule,
    DatetimerangepickerModule,
  ],
})
export class AdministratorModule { }
