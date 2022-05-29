import { UtilitiesService } from './../../../services/utilities/utilities.service';
import { ViewportScroller } from '@angular/common';
import { Component, AfterViewInit, HostListener, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/* import { DataSessionService } from '../../../services/dataSession/data-session.service'; */

@Component({
  selector: 'app-navigation-public',
  templateUrl: './navigation-public.component.html',
  styleUrls: ['./navigation-public.component.scss']
})
export class NavigationPublicComponent implements AfterViewInit {
  @Input() isTransparent = true;

  constructor(public route: ActivatedRoute, private utilitiesService : UtilitiesService,
    public router: Router, ) {}

  ngAfterViewInit() {}

  async scrollTo( idString : string ) {
    let element = document.getElementById(idString);

    if(element){
      try {
        var rect = element.getBoundingClientRect();
        if( rect ){
          window.scrollTo(0, rect.top + window.scrollY - 110);
        }

      } catch (error) {

      }
    }else{
      this.router.navigate(['/'], { fragment: idString });

      let element = document.getElementById(idString);
      do{

        element = document.getElementById(idString);
        if(element){
          try {
            var rect = element.getBoundingClientRect();
            if( rect ){
              window.scrollTo(0, rect.top + window.scrollY - 110);
            }
          } catch (error) {
            element = document.getElementById(idString);
          }
        }else{
          element = document.getElementById(idString);
        }
        await this.utilitiesService.sleep(200);
      }while(!element)
    }
  }
}
