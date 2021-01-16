import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { RequestService } from '../services/RequestService';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { username } from 'src/app/models/username';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLoginError: boolean = false;
  isUInfoError: boolean = false;
  isRegError: boolean = false;

  userI: User = new User();

  constructor(private request: RequestService, private router: Router) {
    const name = Calendar.name; // add this line in your constructor
  }

  calendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth'
  };

  ngOnInit(): void {
  }

  onSubmit(userName, Password) {
    //console.log(signInForm.value);
    //this.router.navigate(['/person']) 
    //signInForm.

    const body = {
      username: userName,
      password: Password
    }
    this.isLoginError = true;



    this.request.userAuthentication(body).subscribe((data: any) => {
      // console.log(data);



      localStorage.setItem('username', body.username);
      localStorage.setItem('tokenID', data);


      this.getPersoneInfo();

    },
      (err: HttpErrorResponse) => {
        this.isLoginError = true;
        setTimeout(() => this.isLoginError = false, 1000);
        console.log(err);
      });



  }

  getPersoneInfo() {
    var us = localStorage.getItem("username");
    //   console.log(us);
    const body = new username();
    body.username = us;
    //  console.log(body);

    this.request.getUserInfo(body).subscribe(

      (data: any) => {

        this.userI.user_username = data.user_username;
        this.userI.user_name = data.user_name;
        this.userI.user_email = data.user_email;
        this.userI.user_role = data.user_role;
        if (data.user_street == "") { this.userI.user_street = "-"; }
        else
          this.userI.user_street = data.user_street;
        if (data.user_place == "") { this.userI.user_place = "-"; }
        else
          this.userI.user_place = data.user_place;
        if (data.user_country == "") { this.userI.user_country = "-"; }
        else this.userI.user_country = data.user_country;

        if (data.user_birthday == "") { this.userI.user_birthday = "-"; }
        else this.userI.user_birthday = data.user_birthday;

        if (data.user_zip_code == "") { this.userI.user_zip_code = "-"; }
        else this.userI.user_zip_code = data.user_zip_code;

        this.savePersone();
      },

      (err: HttpErrorResponse) => {
        this.isUInfoError = true;
      }

    );
  }

  savePersone() {
    localStorage.setItem("userInfo", JSON.stringify(this.userI));

    if (this.userI.user_role != "User") {

      setTimeout(() => {

        this.router.navigate(['/admin'])
      }, 300);

    }
    else {

      setTimeout(() => {

        this.router.navigate(['/person'])
      }, 300);
    }

  }

  goToRegister() {
    setTimeout(() => {
      console.log(this.router)

      this.router.navigate(['/register'])
    }, 300);
  }

}
