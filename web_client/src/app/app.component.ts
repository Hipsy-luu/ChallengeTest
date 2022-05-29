import { Component } from '@angular/core';
/* import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router'; */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {  private sub: any;

  constructor(/* private router: Router */){
    // Listen the navigation events to start or complete the slim bar loading
    /* this.sub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log("inicio");
      } else if (event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError) {
        console.log("acabo");

      }
    }, (error: any) => {
      console.log("acabo error");
    }); */
  }

  /* ngOnDestroy(): any {
    this.sub.unsubscribe();
  } */
}
