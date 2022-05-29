import { Component, AfterViewInit } from '@angular/core';
import { DataSessionService } from '../../../services/dataSession/data-session.service';
declare var $: any;

@Component({
  selector: 'app-footer-public',
  templateUrl: './footer-public.component.html',
  styleUrls: ['./footer-public.component.scss']
})
export class FooterPublicComponent implements AfterViewInit {

  constructor(public dataSessionService: DataSessionService) {}

  ngAfterViewInit() {}

  logOut(){
    this.dataSessionService.logOut();
  }
}
