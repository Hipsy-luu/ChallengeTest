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
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  FILTER_PAG_REGEX = /[^0-9]/g;

  searchValue: String = "";
  newPassword: string = "";
  confirmNewPassword: string = "";

  normalUsersList: UserDto[];
  normalUsersListFiltered: UserDto[];

  selectedNormalUser: UserDto;

  page = 1;
  pageSize = 10;

  showAwaitAnimation: boolean = false;

  userModalForm: FormGroup;

  @ViewChild("modalConfirmResetPassword") modalConfirmResetPassword;
  @ViewChild("modalConfirmDeleteUser") modalConfirmDeleteUser;
  @ViewChild("modalAddEditNewUser") modalAddEditNewUser;

  constructor(private SEOService: SEOService, private modalService: NgbModal, private apiDataService: ApiDataService, 
    public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService, 
    private formBuilder: FormBuilder) {
    this.normalUsersList = [];
    this.normalUsersListFiltered = Array.from(this.normalUsersList);
    this.selectedNormalUser = new UserDto();
    this.showAwaitAnimation = false;

    SEOService.updateMeta(() => { });
  }

  ngOnInit() {
    this.showAwaitAnimation = false;
    this.dataSessionService.checkLogin((response: LoggedResponse) => {
      if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
        this.loadData();
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

  initUserForm() {
    /* this.selectedNormalUser = ({
      idUser: -1,
      idRole: 1,
      name: "test"+Date.now(),
      lastName: "normal",
      motherLastName: "testoito",
      email: Date.now()+"@gmail.com",
      password: "12345678",
      englishLevel: 7,
      technicalKnowledge : "a lot",
      urlCv : "https://drive.google.com/file/d/168oNhbgxyUqyLZkJ9r0bR9l6qaykDs4D/view?usp=sharing",
      deleted: false,
      createdAt : new Date(),
      updatedAt : new Date()
    } as UserDto); */

    let passValidator = [Validators.required, Validators.minLength(8)];

    if (this.selectedNormalUser.idUser != -1) {
      passValidator = [Validators.minLength(8)];
    }

    this.userModalForm = this.formBuilder.group({
      idUser: [this.selectedNormalUser.idUser, []],
      idRole: [this.selectedNormalUser.idRole, []],
      name: [this.selectedNormalUser.name, [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],//
      lastName: [this.selectedNormalUser.lastName, [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],//
      motherLastName: [this.selectedNormalUser.motherLastName, [Validators.required, Validators.minLength(2), Validators.maxLength(45)]],//
      email: [this.selectedNormalUser.email, [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', passValidator],
      passwordConfirm: ['', passValidator],
      englishLevel: [this.selectedNormalUser.englishLevel, [Validators.required]],
      technicalKnowledge : [this.selectedNormalUser.technicalKnowledge, [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      urlCv : [this.selectedNormalUser.urlCv, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
    });
  }

  get idUser(): AbstractControl {
    return this.userModalForm.get('idUser');
  }
  get idRole(): AbstractControl {
    return this.userModalForm.get('idRole');
  }
  get name(): AbstractControl {
    return this.userModalForm.get('name');
  }
  get lastName(): AbstractControl {
    return this.userModalForm.get('lastName');
  }
  get motherLastName(): AbstractControl {
    return this.userModalForm.get('motherLastName');
  }
  get email(): AbstractControl {
    return this.userModalForm.get('email');
  }
  get password(): AbstractControl {
    return this.userModalForm.get('password');
  }
  get passwordConfirm(): AbstractControl {
    return this.userModalForm.get('passwordConfirm');
  }
  get englishLevel(): AbstractControl {
    return this.userModalForm.get('englishLevel');
  }
  get technicalKnowledge(): AbstractControl {
    return this.userModalForm.get('technicalKnowledge');
  }
  get urlCv(): AbstractControl {
    return this.userModalForm.get('urlCv');
  }
  ////////Search and filter functions
  filterByEmail(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.normalUsersListFiltered = Array.from(this.normalUsersList);
    } else {
      this.normalUsersListFiltered = this.normalUsersList.filter(function (user : UserDto) {
        return user.email.toLowerCase().includes(ssearchValue) || 
          (user.name + " " + user.lastName + " " + user.motherLastName ).toLowerCase().includes(ssearchValue)
      });
    }
  }

  ////////////////

  openModalConfirmResetPassword(user: UserDto) {
    this.selectedNormalUser = JSON.parse(JSON.stringify(user));
    this.newPassword = "";
    this.confirmNewPassword = "";

    this.modalService.open(this.modalConfirmResetPassword, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalConfirmDeleteUser() {
    this.modalService.open(this.modalConfirmDeleteUser, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalAddUser() {
    this.selectedNormalUser = new UserDto();

    this.initUserForm();

    this.modalService.open(this.modalAddEditNewUser, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalEditUser(userForUpdate: UserDto) {
    this.selectedNormalUser = JSON.parse(JSON.stringify(userForUpdate));

    this.initUserForm();

    this.modalService.open(this.modalAddEditNewUser, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async loadData() {
    this.normalUsersList = [];
    this.normalUsersListFiltered = [];
    this.searchValue = '';

    this.apiDataService.getNormalUsersListData().subscribe({
      next: (response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          for (let index = 0; index < response.data.userList.length; index++) {
            response.data.userList[index].createdAt = new Date(response.data.userList[index].createdAt);
            response.data.userList[index].updatedAt = new Date(response.data.userList[index].updatedAt);
          }
          this.normalUsersList = [...response.data.userList];
          this.normalUsersListFiltered = Array.from(this.normalUsersList);
  
          //this.openModalEditUser(this.normalUsersListFiltered[0]);
          //this.openModalAddUser();
          //this.openModalConfirmResetPassword(this.normalUsersListFiltered[0])
        }
      }, error: (error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
      }
    });
  }

  async deleteUser() {
    this.showAwaitAnimation = true;
    this.apiDataService.deleteUser(this.selectedNormalUser.idUser).then(async (response : ServerMessage)=>{
      if(response.error == true){
        console.log(response);
        this.utilitiesService.showErrorToast(response.message,"Error");
      }else if(response.error == false){
        this.utilitiesService.showSuccessToast(response.message,"Success");
        this.loadData();
        this.modalService.dismissAll();
      }
      await this.utilitiesService.sleep(1000);
      this.showAwaitAnimation = false;
    }).catch((error)=>{
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("An error has occurred","Error"); 
      this.showAwaitAnimation = false;
    });
  }

  async confirmResetPass() {
    this.showAwaitAnimation = true;

    this.apiDataService.resetUserPassById(this.selectedNormalUser.idUser, this.newPassword ).then((response: ServerMessage) => {
      if (response.error == true) {
        this.utilitiesService.showWarningToast(response.message, "Error");
        console.log(response);
        this.showAwaitAnimation = false;
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Success");
        this.modalService.dismissAll();
        this.showAwaitAnimation = false;
        this.newPassword = "";
        this.confirmNewPassword = "";    
      }
    }).catch(error => {
      console.log(error);
      this.utilitiesService.showErrorToast("Ups An error has occurred", "Error");
      this.showAwaitAnimation = false;
    });
  }

  async onSubmit() {
    this.showAwaitAnimation = true;

    if (this.selectedNormalUser.idUser == -1) {
      this.apiDataService.createUser( this.userModalForm.value ).then(async (response : ServerMessage)=>{
        if(response.error == true){
          console.log(response);
          this.utilitiesService.showErrorToast(response.message,"Error");
        }else if(response.error == false){
          this.loadData();
          this.utilitiesService.showSuccessToast(response.message,"Successful");
          this.modalService.dismissAll();
        }
        await this.utilitiesService.sleep(1000);
        this.showAwaitAnimation =  false;
      }).catch((error)=>{
        this.showAwaitAnimation =  false;
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred","Error");
      });
    } else {
      this.apiDataService.editUser( this.userModalForm.value ).then(async (response : ServerMessage)=>{
        if(response.error == true){
          console.log(response);
          this.utilitiesService.showErrorToast(response.message,"Error");
        }else if(response.error == false){
          this.loadData();
          this.utilitiesService.showSuccessToast(response.message,"Successful");
          //this.modalService.dismissAll();
        }
        await this.utilitiesService.sleep(1000);
        this.showAwaitAnimation =  false;
      }).catch((error)=>{
        this.showAwaitAnimation =  false;
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred","Error");
      });
    }
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }
}
