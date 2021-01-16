import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Direction } from '../models/Direction';
import { Program } from '../models/Program';
import { Data } from '@angular/router';
import { Url } from 'url';
import { JwtHelperService } from '@auth0/angular-jwt';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  isLoggedIn() {
    return !!this.getJwtToken();
  }


  todosUrl: string = '';

  todosLimit = '?_limit=5';
  forecast: string = '';

  helper
  constructor(private http: HttpClient, public jwtHelper: JwtHelperService) {
    this.helper = new JwtHelperService();
  }

  userlogin = '/rest/login';
  userAuthentication(body): Observable<JSON> {
    return this.http.post<JSON>(`${this.todosUrl}${this.userlogin}`, body, httpOptions);
  }


  refToken = '/rest/user/refreshToken';
  refreshToken() {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<JSON>(`${this.getUser}`, '', httpOption);
  }

  userlogout = '/rest/logout';
  logOutUser(token) {
    return this.http.post<JSON>(`${this.todosUrl}${this.userlogout}`, token, httpOptions);
  }

  userReg = '/rest/register/confirm';
  userRegist(body): Observable<JSON> {
    return this.http.post<JSON>(`${this.todosUrl}${this.userReg}`, body, httpOptions);
  }


  uRegister = '/rest/register';
  userRegister(body): Observable<JSON> {
    return this.http.post<JSON>(`${this.todosUrl}${this.uRegister}`, body, httpOptions);
  }


  activateAcc = '/rest/user/activateAccount';
  userActAcc(body): Observable<JSON> {
    return this.http.post<JSON>(`${this.todosUrl}${this.activateAcc}`, body, httpOptions);
  }

  getUser = '/rest/user/get';
  getUserInfo(body): Observable<JSON> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<JSON>(`${this.getUser}`, body, httpOption);
  }

  updateUser = '/rest/update';
  updateUserInfo(body): Observable<JSON> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<JSON>(`${this.updateUser}`, body, httpOption);
  }

  upUserNP = 'rest/update/v2';
  upUserNPInfo(body): Observable<JSON> {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<JSON>(`${this.upUserNP}`, body, httpOption);
  }

  getJwtToken() {
    return localStorage.getItem('tokenID');
  }

  getAdminConf() {
    var u = localStorage.getItem('userInfo');
    if (u != null) {
      if (JSON.parse(u).user_role != 'User') {
        return true;
      }
    }
    return false;
  }

  getPrograms = '/rest/program/user';
  getmyPrograms() {
    const uname = localStorage.getItem('username');
    const body = {
      "username": uname
    }
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<any[]>(`${this.getPrograms}`, body, httpOption);
  }

  subProg = '/rest/program/submit';
  subProgram(program: Program): Observable<JSON> {

    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'token': `${localStorage.getItem('tokenID')}`
      })
    }
    return this.http.post<JSON>(`${this.subProg}`, program, httpOption);
  }

}