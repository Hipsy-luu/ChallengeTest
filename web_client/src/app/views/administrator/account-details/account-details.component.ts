import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { SEOService } from '../../../services/seo/seo.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggedResponse } from '../../../classes/loggedResponse.class';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { ApiDataService } from '../../../services/apiData/api-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDto } from '../../../classes/user.class';



@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  constructor(private SEOService: SEOService,
    public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService, ) {

    SEOService.updateMeta(() => { });
  }

  ngOnInit() {
    this.dataSessionService.checkLogin((response: LoggedResponse) => {
      if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
        
      } else if (this.dataSessionService.user.idRole == 2 ) {//Normal User
        this.dataSessionService.navigateByUrl("/dashboard-normal-user/account-details");
      } else {
        this.utilitiesService.showErrorToast("Unknown user.", "Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      this.dataSessionService.logOut();
    });
  }

}
