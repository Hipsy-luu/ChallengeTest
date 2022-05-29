import { Component, OnInit } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
//MENUS
import { MatDialog } from '@angular/material/dialog';
import { ADMINMENU } from './menu-items';
import { RouteInfo } from '../../../../classes/routeInfo.class';

@Component({
  selector: 'app-sidebar-administrator',
  templateUrl: './sidebar-administrator.component.html',
  styleUrls: ['./sidebar-administrator.component.scss']
})
export class SidebarAdministratorUserComponent implements OnInit {
  showMenu = '';
  showSubMenu = '';
  public sidebarNavItemsAdmin: RouteInfo[];

  constructor(
    public dialog:MatDialog,public dataSessionService: DataSessionService,
  ) {
    this.sidebarNavItemsAdmin = ADMINMENU
   }
  
  ngOnInit() {
    
  }
  
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  addActiveClass(element: any) {
    if (element === this.showSubMenu) {
      this.showSubMenu = '0';
    } else {
      this.showSubMenu = element;
    }
  }
}
