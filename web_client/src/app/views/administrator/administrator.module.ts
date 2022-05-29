import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AdministratorRoutes } from './administrator.routing';
//Home
import { HomeComponent } from './home/home.component';
import { ComponentsModule } from '../../components/components.component';

import { CarouselModule } from 'ngx-owl-carousel-o';
import { MaterialModule } from '../../utils/material';
import { StaffComponent } from './staff/staff.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    //Views - Public
    /* Personalized components */
    
    /* Public Componentes*/

    /* Public views*/
    HomeComponent,
    StaffComponent,
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
  ],
})
export class AdministratorModule { }
