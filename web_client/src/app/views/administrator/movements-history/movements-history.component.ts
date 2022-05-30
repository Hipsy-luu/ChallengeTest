import { TeamMember } from './../../../classes/teams.class';
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



@Component({
  selector: 'app-movements-history',
  templateUrl: './movements-history.component.html',
  styleUrls: ['./movements-history.component.scss']
})
export class MovementsHistoryComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};

  fromDate : Date;
  toDate: Date;
  isCreatedAt : boolean;
  daterangepickerOneOptions /* : Options */;

  FILTER_PAG_REGEX = /[^0-9]/g;

  searchValue: string = "";

  membersHistoryList: TeamMember[];

  selectedMemberHistory: TeamMember;

  page = 1;
  pageSize = 10;
  
  showAwaitAnimation: boolean = false;

  @ViewChild("modalConfirmResetPassword") modalConfirmResetPassword;
  @ViewChild("modalConfirmDeleteUser") modalConfirmDeleteUser;
  @ViewChild("modalAddEditNewUser") modalAddEditNewUser;

  constructor(private SEOService: SEOService, private modalService: NgbModal, private apiDataService: ApiDataService,
    public dataSessionService: DataSessionService, public utilitiesService: UtilitiesService,) {
    this.membersHistoryList = [];
    this.selectedMemberHistory = new TeamMember();
    this.showAwaitAnimation = false;
    this.isCreatedAt = false;
    this.searchValue = ''; 
    
    let newDate = new Date();
    this.fromDate = new Date(newDate.getFullYear(), newDate.getMonth() , 1);
    this.toDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0,23,59);

    let maxDate = new Date();
    maxDate.setFullYear(this.toDate.getFullYear() + 10);

    this.initDatePickerOne(
      this.fromDate,
      this.toDate,
      new Date("01.01.2000 00:00:00"),
      maxDate
    );

    SEOService.updateMeta(() => { });
  }

  ngOnInit() {
    this.showAwaitAnimation = false;
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
  ////////Search and filter functions
  filterByEmail(event) {
    let ssearchValue = event.charAt(0).toLowerCase() + event.slice(1);
    this.searchValue = ssearchValue;
    this.loadData();
  }

  openModalAccount(memberHistory: TeamMember) {
    this.selectedMemberHistory = JSON.parse(JSON.stringify(memberHistory));

    this.modalService.open(this.modalAddEditNewUser, {
      ariaLabelledBy: 'modal-basic-title', centered: true,
    }).result.then((result) => {
      //this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async loadData() {
    this.apiDataService.getMovementsHistory(this.fromDate, this.toDate , this.isCreatedAt,this.searchValue )
      .then(async (response: ServerMessage) => {
        if (response.error == true) {
          console.log(response);
          this.utilitiesService.showErrorToast(response.message, "Error");
        } else if (response.error == false) {
          this.membersHistoryList = response.data.membersHistoryList;
        }
        this.showAwaitAnimation = false;
      }).catch((error) => {
        console.log("error");
        console.log(error);
        this.utilitiesService.showErrorToast("An error has occurred", "Error");
      }); 
  }

  rangeOneSelected(e) {
    //console.log(e);
    this.fromDate = new Date(e.start.$d);
    this.toDate = new Date(e.end.$d);
    this.loadData();
  }

  initDatePickerOne(startDate: Date, endDate: Date, minDate: Date, maxDate: Date,) {
    var el : HTMLCollection = document.getElementsByClassName('drp-btn apply');
    if(el[0]){
      el[0].innerHTML = 
      '<h3 class="no-margin pa-10">'+
        '<i class="fas fa-calendar-check pa-r-10"></i>'+
        'Search'+
      '</h3>';
    }

    this.daterangepickerOneOptions = {
      startDate: this.utilitiesService.getDateTimepikerFormatDayJs(startDate),
      endDate: this.utilitiesService.getDateTimepikerFormatDayJs(endDate),
      
      minDate: this.utilitiesService.getDateTimepikerFormatDayJs(minDate),
      maxDate: this.utilitiesService.getDateTimepikerFormatDayJs(maxDate),

      format: 'DD.MM.YYYY hh:mm:ss',
      displayFormat: 'DD/MM/YYYY hh:mm:ss',

      theme: "light",
      weekStartsOn: 0,
      placeholder: /* this.utilitiesService.getDateTimepikerFormat2(startDate) + 
        " - " + this.utilitiesService.getDateTimepikerFormat2(endDate) */"Seleccione un intervalo de fechas",
      autoApply : true,
      hideControls: false,
      noDefaultRangeSelected: false,
      singleCalendar: false,
      position: "left",
      required: false,
      readOnly: false,
      disabled: false,
      disableWeekEnds: false,
      addTouchSupport: false,
      disableBeforeStart: true,
      inactiveBeforeStart: true,
      alwaysOpen: false,
      showRanges: false,
      timePicker: {
        minuteInterval: 1,
        twentyFourHourFormat: false,
      },
      preDefinedRanges: [],
      disabledDays: [],
      disabledDates: [],
    }
  }

  selectPage(page: string) {
    this.page = parseInt(page, 10) || 1;
  }

  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
  }
}
