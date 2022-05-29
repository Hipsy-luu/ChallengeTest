import { UtilitiesService } from '../../../services/utilities/utilities.service';
import {
  Component,
  Input,
  OnDestroy,
  Inject,
  ViewEncapsulation
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-spinner',
  /* template: `<div class="preloader" *ngIf="isSpinnerVisible">
        <div class="spinner">
          <div class="double-bounce1"></div>
          <div class="double-bounce2"></div>
        </div>
    </div>`, */
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnDestroy {
  public isSpinnerVisible = true;

  @Input() public backgroundColor = 'rgba(0, 115, 170, 0.69)';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private utilitiesService : UtilitiesService
  ) {
    this.router.events.subscribe(
      async event => {
        if (event instanceof NavigationStart) {
          this.isSpinnerVisible = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          
          //await this.utilitiesService.sleep(10000);
          //console.log("ddddd");
          this.isSpinnerVisible = false;
        }
      },
      async () => {
        //console.log("dddddssss");
        //await this.utilitiesService.sleep(10000);
        this.isSpinnerVisible = false;
        
      }
    );
  }

  ngOnDestroy(): void {
    this.isSpinnerVisible = false;
  }
}
