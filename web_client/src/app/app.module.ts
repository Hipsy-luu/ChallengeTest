/* Default app imports for this architecture */
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/* Router */
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
/* Layouts */
import { BlankComponent } from './layouts/blank/blank.component';
import { FullAdministratorUserComponent } from './layouts/full-administrator-user/full-administrator-user.component';
/* Layouts Components */
import { NavigationAdministratorComponent } from './components/dashboards/administrator/header-navigation-administrator/navigation-administrator.component';
import { NavigationPublicComponent } from './components/public/header-navigation-public/navigation-public.component';
import { FooterPublicComponent } from './components/public/footer-public/footer-public.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

/* Library's */
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG,PerfectScrollbarConfigInterface,PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SidebarAdministratorUserComponent } from './components/dashboards/administrator/sidebar-administrator/sidebar-administrator.component';
import { MaterialModule } from './utils/material';

/* Components with out module */

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    /* Principal Component */
    AppComponent,
    /* Layouts */
    BlankComponent,
    FullAdministratorUserComponent,
    /* Layouts Components */
    NavigationAdministratorComponent,
    SidebarAdministratorUserComponent,
    
    NavigationPublicComponent,
    FooterPublicComponent,
    BreadcrumbComponent,
    //Components with out module
    
  ],
  imports: [// Imports for all app
    CommonModule,
    /* Gives the directives and biding functions in the components */
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    /* This module has and gives the principal router ability and routes  */
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgbModule,
    MaterialModule,
    PerfectScrollbarModule,
  ],
  providers: [
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
        provide: LocationStrategy,
        useClass: HashLocationStrategy
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
