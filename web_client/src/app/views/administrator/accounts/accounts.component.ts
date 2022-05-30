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
import { Account } from '../../../classes/account.class';
import { UserDto } from '../../../classes/user.class';
import { TeamMember } from '../../../classes/teams.class';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  FILTER_PAG_REGEX = /[^0-9]/g;

  searchValue: String = "";

  accountsList: Account[];
  accountsListFiltered: Account[];

  selectedAccount: Account;

  page = 1;
  pageSize = 10;

  showAwaitAnimation: boolean = false;

  accountModalForm: FormGroup;

  showAwaitSearch: boolean = false;
  searchUserValue: String = "";
  usersList: UserDto[];
  actualIds: number[];
  actualIdsForDelete: number[];

  @ViewChild("modalConfirmResetPassword") modalConfirmResetPassword;
  @ViewChild("modalConfirmDelete") modalConfirmDelete;
  @ViewChild("modalAddEditNew") modalAddEditNew;
  @ViewChild("modalSearchUser") modalSearchUser;

  constructor(private SEOService: SEOService, private modalService: NgbModal, private apiDataService: ApiDataService,
    public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,
    private formBuilder: FormBuilder) {
    this.accountsList = [];
    this.actualIdsForDelete = [];
    this.accountsListFiltered = Array.from(this.accountsList);
    this.selectedAccount = new Account();
    this.showAwaitAnimation = false;
    this.showAwaitSearch = false;

    SEOService.updateMeta(() => { });
  }

  ngOnInit() {
    this.showAwaitAnimation = false;
    this.showAwaitSearch = false;
    this.dataSessionService.checkLogin((response: LoggedResponse) => {
      if (this.dataSessionService.user.idRole == 0 || this.dataSessionService.user.idRole == 1) {//Super admin and admin
        this.loadData();
      } else if (this.dataSessionService.user.idRole == 2) {//Normal User
        this.dataSessionService.navigateByUrl("/dashboard-normal-user/account-details");
      } else {
        this.utilitiesService.showErrorToast("Unknown user.", "Error!");
        this.dataSessionService.logOut();
      }
    }, (noLoginResponse: LoggedResponse) => {
      this.dataSessionService.logOut();
    });
  }

  initAccountForm() {
    /* this.selectedAccount.idAccount= -1;
    this.selectedAccount.accountName = "cuenta cliente";
    this.selectedAccount.clientName = "nombre cliente";
    this.selectedAccount.personInCharge = "acargo test";
    this.selectedAccount.deleted= false;
    this.selectedAccount.createdAt = new Date();
    this.selectedAccount.updatedAt = new Date(); */

    this.actualIdsForDelete = [];

    this.accountModalForm = this.formBuilder.group({
      idAccount: [this.selectedAccount.idAccount, []],
      accountName: [this.selectedAccount.accountName, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],//
      clientName: [this.selectedAccount.clientName, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],//
      personInCharge: [this.selectedAccount.personInCharge, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],//
    });
  }

  get idAccount(): AbstractControl {
    return this.accountModalForm.get('idAccount');
  }
  get accountName(): AbstractControl {
    return this.accountModalForm.get('accountName');
  }
  get clientName(): AbstractControl {
    return this.accountModalForm.get('clientName');
  }
  get personInCharge(): AbstractControl {
    return this.accountModalForm.get('personInCharge');
  }
  ////////Search and filter functions
  filterByEmail(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    if (this.searchValue == "") {
      this.accountsListFiltered = Array.from(this.accountsList);
    } else {
      this.accountsListFiltered = this.accountsList.filter(function (user: Account) {
        return user.personInCharge.toLowerCase().includes(ssearchValue) ||
          (user.accountName + " " + user.clientName).toLowerCase().includes(ssearchValue)
      });
    }
  }
  searchUserToAdd(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);

    if (this.searchUserValue == "") {
      this.usersList = [];
    } else {
      this.usersList = [];
      this.apiDataService.searchUsersByNameEmail({
        searchValue: ssearchValue,
        actualIds: this.actualIds,
      }).then((response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          for (let index = 0; index < response.data.userList.length; index++) {
            response.data.userList[index].createdAt = new Date(response.data.userList[index].createdAt);
            response.data.userList[index].updatedAt = new Date(response.data.userList[index].updatedAt);
          }
          this.usersList = [...response.data.userList];
        }
      }).catch((error) => {
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
      });
    }
  }

  addUserToList(user: UserDto, modal: any) {
    this.selectedAccount.teamMembers.push({
      idTeamMembers: -1,
      idAccount: this.selectedAccount.idAccount,
      idUser: user.idUser,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: JSON.parse(JSON.stringify(user))
    });
    modal.dismiss('Cross click')
  }
  deleteUserToList(user: UserDto, idTeamMembers: number) {
    this.selectedAccount.teamMembers = this.selectedAccount.teamMembers.filter((teamMember: TeamMember) => {
      return teamMember.idUser != user.idUser;
    });

    if (idTeamMembers != -1) {
      this.actualIdsForDelete.push(user.idUser);
    }
  }
  ////////////////
  openModalConfirmDeleteAccount() {
    this.showAwaitAnimation = true;
    this.showAwaitSearch = false;
    this.modalService.open(this.modalConfirmDelete, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      this.showAwaitAnimation = false;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.showAwaitAnimation = false;
    });
  }
  openModalSearchUser() {
    this.showAwaitAnimation = true;
    this.showAwaitSearch = false;
    this.usersList = [];
    this.actualIds = [];
    this.searchUserValue = "";

    for (let index = 0; index < this.selectedAccount.teamMembers.length; index++) {
      const element: TeamMember = this.selectedAccount.teamMembers[index];
      this.actualIds.push(element.idUser);
    }

    this.modalService.open(this.modalSearchUser, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
      this.showAwaitAnimation = false;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.showAwaitAnimation = false;
    });
  }

  openModalAddAccount() {
    this.selectedAccount = new Account();

    this.initAccountForm();

    this.modalService.open(this.modalAddEditNew, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalEditAccount(accountForUpdate: Account) {
    this.selectedAccount = JSON.parse(JSON.stringify(accountForUpdate));

    this.initAccountForm();

    this.modalService.open(this.modalAddEditNew, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async loadData() {
    this.accountsList = [];
    this.accountsListFiltered = [];
    this.searchValue = '';

    this.apiDataService.getAccountsListData().subscribe({
      next: (response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          for (let index = 0; index < response.data.accountList.length; index++) {
            response.data.accountList[index].createdAt = new Date(response.data.accountList[index].createdAt);
            response.data.accountList[index].updatedAt = new Date(response.data.accountList[index].updatedAt);
          }
          this.accountsList = [...response.data.accountList];
          this.accountsListFiltered = Array.from(this.accountsList);
  
          //this.openModalAddAccount();
        }
      }, error: (error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
      }
    });
  }

  async deleteAccount() {
    this.showAwaitSearch = true;
    this.apiDataService.deleteAccount(this.selectedAccount.idAccount).then(async (response: ServerMessage) => {
      if (response.error == true) {
        console.log(response);
        this.utilitiesService.showErrorToast(response.message, "Error");
      } else if (response.error == false) {
        this.utilitiesService.showSuccessToast(response.message, "Success");
        this.loadData();
        this.modalService.dismissAll();
      }
      await this.utilitiesService.sleep(1000);
      this.showAwaitSearch = false;
    }).catch((error) => {
      console.log("error");
      console.log(error);
      this.utilitiesService.showErrorToast("An error has occurred", "Error");
      this.showAwaitSearch = false;
    });
  }

  async onSubmit() {
    this.showAwaitAnimation = true;

    if (this.selectedAccount.idAccount == -1) {
      this.apiDataService.createAccount({
        newAccount: this.accountModalForm.value,
        teamMembers: this.selectedAccount.teamMembers,
      }).then(async (response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          this.loadData();
          this.utilitiesService.showSuccessToast(response.message, "Successful");
          this.modalService.dismissAll();
        }
        await this.utilitiesService.sleep(1000);
        this.showAwaitAnimation = false;
      }).catch((error) => {
        this.showAwaitAnimation = false;
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
      });
    } else {
      this.apiDataService.updateAccount({
        newAccount: this.accountModalForm.value,
        teamMembers: this.selectedAccount.teamMembers,
        actualIdsForDelete: this.actualIdsForDelete
      }).then(async (response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          this.loadData();
          this.utilitiesService.showSuccessToast(response.message, "Successful");
        }
        await this.utilitiesService.sleep(1000);
        this.showAwaitAnimation = false;
      }).catch((error) => {
        this.showAwaitAnimation = false;
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
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
