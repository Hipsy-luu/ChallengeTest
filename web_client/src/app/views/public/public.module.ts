import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PublicRoutes } from './public.routing';

import { LoginComponent } from './login/login.component';
import { NotfoundComponent } from './404/not-found.component';
/* Global Imports */
import { ComponentsModule } from '../../components/components.component';

import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    //Views - Public
    /* Personalized components */

    /* Public views*/
    LoginComponent,
    NotfoundComponent,
  ],
  imports: [
    CommonModule,/* Gives the directives and biding functions in the components */
    FormsModule,
    ReactiveFormsModule,
    //Imports only for this module
    /* This module has and gives the principal router ability and routes  */
    RouterModule.forChild(PublicRoutes),

    
    ComponentsModule,
    /* Owl carrousel */
    CarouselModule,
  ],
  exports: []
})
export class PublicModule { }
