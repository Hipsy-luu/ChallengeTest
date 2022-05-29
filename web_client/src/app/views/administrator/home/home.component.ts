import { Component, OnInit} from '@angular/core';
import { SEOService } from '../../../services/seo/seo.service';
import { FormBuilder } from '@angular/forms';
import { LoggedResponse } from '../../../classes/loggedResponse.class';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor( private SEOService : SEOService,public dataSessionService: DataSessionService, 
    private utilitiesService: UtilitiesService,) {
    SEOService.updateMeta(() => { }); 
  }

  ngOnInit(){
    this.dataSessionService.checkLogin((response: LoggedResponse) => {
      if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
        
      } else if (this.dataSessionService.user.idRole == 2 ) {//Normal User
        this.utilitiesService.showSuccessToast(response.message, "Success!");
        //this.dataSessionService.navigateByUrl("/dashboard-administrator/home");
      } else {
        this.utilitiesService.showErrorToast("Unknown user.", "Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      this.dataSessionService.logOut();
    });
  }
}
