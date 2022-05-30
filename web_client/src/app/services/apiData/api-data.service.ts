import { Account } from './../../classes/account.class';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { deployConf } from '../../utils/config';
import { ServerMessage } from '../../classes/serverMessage.class';
import { timeout, catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs/internal/Observable';
import { UserDto } from '../../classes/user.class';
import { TeamMember } from '../../classes/teams.class';

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {
  baseURL: string = deployConf.apiUrl;
  token:  string | null;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.token = null;
  }

  //USER END-POINTS
  setToken( newToken: string | null ) {
    this.token = newToken;
  }
  doLogin(email: String, password: String): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      const data = { email: email, password: password };

      this.http.post<ServerMessage>(this.baseURL + 'auth/login', data, {}).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }
  getUserData(token: string | null): Promise<ServerMessage> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      })

      this.http.get<ServerMessage>(this.baseURL + 'auth/validate-token', { headers: headers }).subscribe((response: ServerMessage) => {
        resolve(response);
      }, (error) => {
        reject(error)
      });
    })
  }
  /* CRUD STAF */
  getNormalUsersListData() : Observable<ServerMessage> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    return this.http.get<ServerMessage>(this.baseURL + 'admin/user/get-normal-user-list', { headers: headers });
  }

  async createUser(newUserData : UserDto) : Promise<ServerMessage>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/user/create-new-user',newUserData,{headers:headers})
        .subscribe({
          next : resolve,
          error : reject
        });
    })
  }

  async editUser(newUserData : UserDto) : Promise<ServerMessage>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/user/edit-user',newUserData,{headers:headers})
        .subscribe({
          next : resolve
          ,error : reject
        });
    })
  }

  async deleteUser(idUser: number) : Promise<ServerMessage> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get<ServerMessage>(this.baseURL + 'admin/user/delete-user/'+idUser,{ headers: headers }).subscribe({
        next : resolve,
        error : reject
      });
    });
  }

  async resetUserPassById(idUser : number,newPassword: string) : Promise<ServerMessage> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/user/reset-user-pass',{ 
        idUser : idUser,
        newPassword : newPassword
       },{headers:headers}).subscribe({
         next : resolve,
         error : reject
        });
    })
  }
  /* CRUD ACCOUNTS */
  async searchUsersByNameEmail(data : { searchValue : string , actualIds : number[]}): Promise<ServerMessage>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/accounts/search-users-by-name-email',data,{headers:headers})
        .subscribe({
          next : resolve,
          error : reject
        });
    })
  }

  getAccountsListData() : Observable<ServerMessage> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
    });
    return this.http.get<ServerMessage>(this.baseURL + 'admin/accounts/get-accounts-list', { headers: headers });
  }

  async createAccount(newAccountData : {
    newAccount : Account,
    teamMembers : TeamMember[],
  }) : Promise<ServerMessage>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/accounts/create-new-account',newAccountData,{headers:headers})
        .subscribe({
          next : resolve,
          error : reject
        });
    })
  }

  async updateAccount(newAccountData : {
    newAccount : Account,
    teamMembers : TeamMember[],
    actualIdsForDelete : number[]
  }) : Promise<ServerMessage>{
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token,
      });

      this.http.post<ServerMessage>(this.baseURL + 'admin/accounts/update-account',newAccountData,{headers:headers})
        .subscribe({
          next : resolve,
          error : reject
        });
    })
  }

  async deleteAccount(idAccount : number) : Promise<ServerMessage> {
    return new Promise((resolve,reject)=>{
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+this.token
      })
       
      this.http.get<ServerMessage>(this.baseURL + 'admin/accounts/delete-account/'+idAccount,{ headers: headers }).subscribe({
        next : resolve,
        error : reject
      });
    });
  }

  /* MOVEMENTS HISTORY */
  getMovementsHistory(fromDate: Date, toDate: Date , isCreatedAt : boolean, search : string) : Promise<ServerMessage>  {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })

      this.http.post<ServerMessage>(this.baseURL + 'admin/tracker/get-movements-history', {
        fromDate: fromDate,
        toDate: toDate,
        isCreatedAt : isCreatedAt,
        search : search
      }, { headers: headers }).subscribe({
        next : resolve,
        error : reject
      });
    });
  }
}
