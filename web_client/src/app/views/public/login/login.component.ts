import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
import { SEOService } from '../../../services/seo/seo.service';
import { UtilitiesService } from '../../../services/utilities/utilities.service';
import { LoggedResponse } from '../../../classes/loggedResponse.class';
import { ServerMessage } from '../../../classes/serverMessage.class';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ApiDataService } from '../../../services/apiData/api-data.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  awaitAnimation: boolean;
  newSessionDataForm: FormGroup;

  constructor(public dataSessionService: DataSessionService, private utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder, private SEOService: SEOService) {
    SEOService.updateMeta(() => { });
    this.awaitAnimation = false;

    this.initForm();
  }

  ngOnInit(): void {
    this.initForm();

    this.dataSessionService.checkLogin((response: LoggedResponse) => {
      if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
        this.utilitiesService.showSuccessToast(response.message, "Success!");
        this.dataSessionService.navigateByUrl("/dashboard-administrator/home");
      } else if (this.dataSessionService.user.idRole == 2 ) {//Normal User
        this.utilitiesService.showSuccessToast(response.message, "Success!");
        this.dataSessionService.navigateByUrl("/dashboard-normal-user/account-details");
      } else {
        this.utilitiesService.showErrorToast("Unknown user.", "Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      //console.log(noLoginResponse);
    });
  }

  get email(): AbstractControl {
    return this.newSessionDataForm?.get('email') as FormGroup | AbstractControl;
  }

  get password(): AbstractControl {
    return this.newSessionDataForm?.get('password') as FormGroup | AbstractControl;
  }

  initForm() {
    this.awaitAnimation = false;
    
    this.newSessionDataForm = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      //email: ['benito.testito@gmail.com', [Validators.email, Validators.required]], //Super admin
      //password: ['50YujDBiAF6NNOEx', [Validators.minLength(8), Validators.required]],
    });
  }

  async loginUser() {
    this.awaitAnimation = true;
    this.dataSessionService.loginUser(this.email.value, this.password.value).then((response: ServerMessage) => {
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error!");
      } else if (response.error == false) {
        this.initForm();
        //load user data
        this.dataSessionService.setUserData(response.data.user);

        if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
          this.utilitiesService.showSuccessToast(response.message, "Success!");
          this.dataSessionService.navigateByUrl("/dashboard-administrator/home");
        } else if (this.dataSessionService.user.idRole == 2 ) {//Normal User
          this.utilitiesService.showSuccessToast(response.message, "Success!");
          this.dataSessionService.navigateByUrl("/dashboard-normal-user/account-details");
        } else {
          this.utilitiesService.showErrorToast("Unknown user.", "Error!");
          this.dataSessionService.logOut();
        }
      }
      this.awaitAnimation = false;
    }, (error) => {
      console.log(error);
      this.utilitiesService.showWarningToast(error.message, "Error!");
      this.awaitAnimation = false;
    });
  }
}
