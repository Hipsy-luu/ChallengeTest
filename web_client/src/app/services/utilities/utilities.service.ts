import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
//import  * as printJS from 'print-js';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {
  public validYoutubeUrl = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;

  constructor(private toastr: ToastrService,private ngZone: NgZone/* public changeDetectorRef : ChangeDetectorRef */) { }

  validateYoutubeUrl(url: string) {
    return this.validYoutubeUrl.test(url)
  }

  createDateAsUTC(date: Date) {
    let dateFixed = new Date(date);
    return new Date(
      Date.UTC(
        dateFixed.getFullYear(),
        dateFixed.getMonth(),
        dateFixed.getDate(),
        dateFixed.getHours(),
        dateFixed.getMinutes(),
        dateFixed.getSeconds(),
      ),
    );
  }

  /**
   *
   */
  convertDateToUTC(date: Date) {
    let dateFixed = new Date(date);
    return new Date(
      dateFixed.getUTCFullYear(),
      dateFixed.getUTCMonth(),
      dateFixed.getUTCDate(),
      dateFixed.getUTCHours(),
      dateFixed.getUTCMinutes(),
      dateFixed.getUTCSeconds(),
    );
  }

  getDateTimepikerFormat( dateToFix : any ){
    const fixedType = new Date(dateToFix);

    let montNum = fixedType.getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
    let fixDate = fixedType.getDate().toString().length == 1 ? "0" + fixedType.getDate() : fixedType.getDate();
    let dateFixed = "" + fixDate + "." + fixMont + "." + fixedType.getFullYear();


    let fixHour = fixedType.getHours().toString().length == 1 ? "0" + fixedType.getHours() : fixedType.getHours();
    let fixMin = fixedType.getMinutes().toString().length == 1 ? "0" + fixedType.getMinutes() : fixedType.getMinutes();
    let timeFixed =  "" + fixHour + ":" + fixMin;

    //console.log(dateFixed + ' ' + timeFixed+':00');
    return dateFixed + ' ' + timeFixed+':00';
  }

  getOnlyDate(string : any) {
    let montNum = new Date(string).getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
    return "" + new Date(string).getFullYear() + "-" + fixMont + "-" + new Date(string).getDate();
  }

  getOnlyYearMonth(string : string) {
    let montNum = new Date(string).getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
    return fixMont + "/" + new Date(string).getFullYear() /* + "-" + new Date(string).getDate(); */
  }

  getOnlyDatePluss10Years(string : string) {
    let montNum = new Date(string).getUTCMonth() + 1;
    let fixMont = montNum.toString().length == 1 ? "0" + montNum : montNum;
    return "" + (new Date(string).getFullYear()+10) + "-" + fixMont + "-" + new Date(string).getDate();
  }

  getOnlyDatePlus10(string : string) {
    return (new Date(string).getFullYear() )+10
  }

  getOnlyTime(string : string) {
    const birthday = new Date(string);
    let fixMin = birthday.getMinutes().toString().length == 1 ? "0" + birthday.getMinutes() : birthday.getMinutes();
    return "" + birthday.getHours() + ":" + fixMin;
  }

  getOnlyDateGasFix(dateToFix: Date): any {
    let dateFixed: Date = this.convertDateToUTC(new Date(dateToFix));
    return dateFixed.toLocaleDateString("es-MX", { year: "numeric" }) + '-' +
      dateFixed.toLocaleDateString("es-MX", { month: "2-digit" }) + '-' +
      dateFixed.toLocaleDateString("es-MX", { day: "2-digit" });
  }

  getOnlyTimeGasFix(dateToFix: Date): any {
    let dateFixed: Date = this.convertDateToUTC(new Date(dateToFix));
    let fixMin = dateFixed.getMinutes().toString().length == 1 ? "0" + dateFixed.getMinutes() : dateFixed.getMinutes();
    return "" + dateFixed.getHours() + ":" + fixMin;
  }

  getFullFixedDate(dateToFix: Date): any {
    let dateFixed : Date = new  Date(dateToFix);
    dateFixed.setHours( dateFixed.getHours() +5 );
    dateFixed.setMinutes( dateFixed.getMinutes() - 30 );
    return dateFixed.toLocaleDateString("en-US", {year: "2-digit",month: "2-digit",day: "2-digit" ,hour: '2-digit', minute:'2-digit', timeZone: 'America/Chihuahua' ,localeMatcher : 'best fit'});
  }

  capitalizeFirstLetter(string : string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  camelize(str: string) {
    let temp: string[] = str.split(" ");
    let tempString = this.capitalizeFirstLetter(temp[0]);

    for (let index = 1; index < temp.length; index++) {
      tempString = tempString + " " + this.capitalizeFirstLetter(temp[index]);

    }
    return tempString;
  }

  addMonths(months: number, date: Date = new Date()): Date {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  //TOAST
  showSuccessToast(message: string, title: string) {
    this.ngZone.run(() => {
      this.toastr.success(message, title);
    });
  }

  showErrorToast(message: string, title: string) {
    this.ngZone.run(() => {
      this.toastr.error(message, title);
    });
  }

  showWarningToast(message: string, title: string) {
    this.ngZone.run(() => {
      this.toastr.warning(message, title);
    });
  }

  async showInfoToast(message: string) {
    this.ngZone.run(() => {
      this.toastr.info(message);
    });
  }

  //END. TOAST

  //XX/XX
  formatDate1(dateToFix: Date): string {
    return dateToFix.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  formatDate2(dateToFix: Date): string {
    return dateToFix.toLocaleDateString("es-MX", { year: "numeric" }) + '-' +
      dateToFix.toLocaleDateString("es-MX", { month: "2-digit" }) + '-' +
      dateToFix.toLocaleDateString("es-MX", { day: "2-digit" });
  }

  sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  downloadBlob(blob: any, name: any) {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blob;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  }

  /* printImageString64(blob, name) {
    try {
      printJS( {printable: blob, type: 'image', base64 : true,css : '@page {margin:0 -6cm} html {margin:0 6cm}',documentTitle : name,header: '',} );
    } catch (error) {
      //console.log(error);

    }
  } */
}
