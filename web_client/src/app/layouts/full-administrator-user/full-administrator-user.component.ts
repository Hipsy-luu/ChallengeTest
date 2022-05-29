import { DataSessionService } from '../../services/dataSession/data-session.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

@Component({
  selector: 'full-administrator-user-layout',
  templateUrl: './full-administrator-user.component.html',
  styleUrls: ['./full-administrator-user.component.scss']
})
export class FullAdministratorUserComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  tabStatus = 'justified';

  public isCollapsed = false;

  public innerWidth: any;
  public defaultSidebar: any;
  public showSettings = false;
  public showMobileMenu = false;

  options = {
    theme: 'light', // two possible values: light, dark
    dir: 'ltr', // two possible values: ltr, rtl
    layout: 'vertical', // fixed value. shouldn't be changed.
    sidebartype: 'full', // four possible values: full, iconbar, overlay, mini-sidebar
    sidebarpos: 'fixed', // two possible values: fixed, absolute
    headerpos: 'fixed', // two possible values: fixed, absolute
    boxed: 'full', // two possible values: full, boxed
    navbarbg: 'skin7', // six possible values: skin(1/2/3/4/5/6)
    sidebarbg: 'skin5', // six possible values: skin(1/2/3/4/5/6)
    logobg: 'skin5' // six possible values: skin(1/2/3/4/5/6)
  };
  
  constructor(public router: Router,public dataSessionService : DataSessionService) { }

  ngAfterViewInit(){
    
  }

  ngOnInit() {
    this.defaultSidebar = this.options.sidebartype;
    //Esto simula un click para abrir el menu
    //this.handleSidebar();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event ?: any) {
    this.handleSidebar();
  }
  //Para los tamaños de pantalla
  handleSidebar() {
    this.innerWidth = window.innerWidth;
    switch (this.defaultSidebar) {
      case 'full':
        this.options.sidebartype = 'mini-sidebar';
        break;
      case 'iconbar':
        if (this.innerWidth < 1170) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      case 'overlay':
        if (this.innerWidth < 767) {
          this.options.sidebartype = 'mini-sidebar';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }

  toggleSidebarType() {
    switch (this.options.sidebartype) {
      case 'full':
      case 'iconbar':
        this.options.sidebartype = 'mini-sidebar';
        break;

      case 'overlay':
        this.showMobileMenu = !this.showMobileMenu;
        break;

      case 'mini-sidebar':
        if (this.defaultSidebar === 'mini-sidebar') {
          this.options.sidebartype = 'full';
        } else {
          this.options.sidebartype = this.defaultSidebar;
        }
        break;

      default:
    }
  }
}
