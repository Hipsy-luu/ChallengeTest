import { Component, HostListener, AfterContentInit, Input, Output, EventEmitter } from '@angular/core';
import { DataSessionService } from '../../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../../services/utilities/utilities.service';

@Component({
  selector: 'app-navigation-administrator',
  templateUrl: './navigation-administrator.component.html',
  styleUrls: ['./navigation-administrator.component.scss']
})
export class NavigationAdministratorComponent implements AfterContentInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Input() searchClosed : boolean;

  isTop: boolean;
  openMenu: boolean;

  constructor(public dataSessionService: DataSessionService,public utilitiesService: UtilitiesService) {
    this.isTop = true;
  }

  async ngAfterContentInit(){
    
  }

  @HostListener('window:scroll', [])
  async onWindowScroll() {
    if (document.body.scrollTop > 30 || document.documentElement.scrollTop > 30) {
      if (this.isTop == true) {
        this.isTop = false;
      }
      let p = document.querySelector('.navbar-register');
      if(p){
        p.classList.add('fixed-shadow');
      }
      this.openMenuNav(false);
    } else {
      if (this.isTop == false) {
        this.isTop = true;
      }
      await this.utilitiesService.sleep(50);
      let p = document.querySelector('.navbar-register');

      if(p){
        p.classList.remove('fixed-shadow');
      }
      this.openMenuNav();
    }
  }

  async openMenuNav(opcMenu: boolean = true) {
    if (opcMenu) {
      if (!this.openMenu) {
        this.openMenu = opcMenu;
        await this.utilitiesService.sleep(50);
      } else {
        this.openMenu = opcMenu;
      }
    } else {
      this.openMenu = opcMenu;
    }
  }

  logOut() {
    this.dataSessionService.logOut();
  }
}
