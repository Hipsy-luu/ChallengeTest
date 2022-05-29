import { UtilitiesService } from './../utilities/utilities.service';
import { Injectable } from '@angular/core';
import { UserDto } from '../../classes/user.class';
import { Router } from '@angular/router';
import { ApiDataService } from '../apiData/api-data.service';
import { ServerMessage } from '../../classes/serverMessage.class';
import { LoggedResponse } from '../../classes/loggedResponse.class';

@Injectable({
  providedIn: 'root'
})
export class DataSessionService {
  baseURL: string;
  token: string | null;

  alreadyLoged: Boolean = false;

  user: UserDto;
  haveLogo : boolean = false;

  constructor(private apiDataService: ApiDataService, public route: Router, private utilitiesService: UtilitiesService) {
    this.token = "";
    this.user = new UserDto();
    this.baseURL = apiDataService.baseURL;
    this.haveLogo = false;
    let token = localStorage.getItem('token');
    if (!token) {
      console.log("Primer uso");
      localStorage.setItem('token', JSON.stringify(this.token));
    } else {
      this.token = JSON.parse(token);
      this.apiDataService.setToken(this.token);
      //Acciones a realizar cuando el token estaba ya guardado pero la data para la interfaz no esta disponible
      //Se sabe que no esta disponible porque apenas se mando llamar el contructor
      if ( this.token.length > 0) {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          if (response.error == true) {
            console.log(response);
            this.utilitiesService.showErrorToast("A ocurrido un error", "Error");
          } else {
            this.setUserData(response.data.user);
          }
        }, (error) => {
          console.log(error);
        });

      };
    }
  }

  navigateByUrl(url: String) {
    this.route.navigateByUrl(url.toString());
  }

  checkLogin( successCallBack : any , errorCallBack : any ) {
    if (this.token == "") {
      errorCallBack(new LoggedResponse(true, "Sin token"))
    } else {
      this.apiDataService.setToken(this.token);
      if (this.user.email == "") {
        this.apiDataService.getUserData(this.token).then((response: ServerMessage) => {
          if (response.error == true) {
            this.navigateByUrl("/login");
            errorCallBack(new LoggedResponse(false, response.message))
          } else if (response.error == false){
            //Obtain user sesión data
            this.setUserData(response.data.user);
            successCallBack(new LoggedResponse(false, "Con token y usuario actualizado"));
          }
        }, (error) => {
          console.log(error);
          errorCallBack(new LoggedResponse(true, "A ocurrido un error"));
        });
      } else {
        successCallBack(new LoggedResponse(false, "Sesión Con token e información de usuario"));
      }
    }
  }

  loginUser(email: String, password: String) : Promise<ServerMessage>{
    return new Promise((resolve, reject) => {
      this.apiDataService.doLogin(email, password).then((response: ServerMessage) => {
        if (response.error == true) {
          reject(response)
        } else if (response.error == false){
          //Lógica con la que guardamos los datos del inicio de sesión
          localStorage.setItem('token', JSON.stringify(response.data.token));
          this.token = response.data.token;
          this.apiDataService.setToken(this.token);
          resolve(response);
        }
      }, (error) => {
        reject(error)
      });
    });
  }

  async setUserData(updatedData: any) {
    this.user.idUser = updatedData.idUser;
    this.user.idRole = updatedData.idRole;
    this.user.name = updatedData.name;
    this.user.lastName = updatedData.lastName;
    this.user.motherLastName = updatedData.motherLastName;
    this.user.email = updatedData.email;
    this.user.englishLevel = updatedData.englishLevel;
    this.user.technicalKnowledge = updatedData.technicalKnowledge;
    this.user.urlCv = updatedData.urlCv;
    this.user.deleted = updatedData.deleted;
    this.user.updatedAt = new Date(updatedData.updatedAt);
    this.user.createdAt = new Date(updatedData.createdAt);
  }

  logOut() {
    this.user = new UserDto();
    localStorage.setItem('token', "");
    this.token = localStorage.getItem('token');
    this.route.navigateByUrl('/');
  }

  goToLink(url : string): void {
    this.route.navigateByUrl(url);
  }
}
