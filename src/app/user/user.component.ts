import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { Program } from 'src/app/models/Program';
import { RouteConfigLoadStart, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RequestService } from 'src/app/services/RequestService';
//import { MatTabChangeEvent } from '@angular/material/tabs';
import { HttpErrorResponse } from '@angular/common/http';
import { username } from 'src/app/models/username';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { Route } from '@angular/compiler/src/core';
import { element } from 'protractor';
//import { NgbdModalBasic } from 'src/app/user/modal/modal-basic'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import * as uuid from 'uuid';
import * as moment from 'moment';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface EventData {
  //username: string;
  title: string;
  start: string;
  color: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  isUInfoError: boolean = false;
  userI: User = new User();
  index: any;
  picSrc: any;
  link: string = '/';
  closeResult: string;
  //modal: NgbdModalBasic = new NgbdModalBasic(private modalService: NgbModal);
  isLoginError: boolean = false;
  isRequestError: boolean = false;
  isRequestSuccess: boolean = false;
  //dataSource;
  ELEMENT_DATA: EventData[] = [];

  calendarPlugins = [dayGridPlugin];

  public workouts: any[] = [{
    id: 1,
    name: '',
    sets: '',
    reps: '',
    weight: '',
    time: ''
  }];

  public user: any = {
    id: uuid.v4(),
    name: '',
    type: '',
    date: '',
    color: '',
    workouts: []
  };

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    contentHeight: 'auto',
    fixedWeekCount: false,
    editable: true,
    slotDuration: '01:00:00',
    firstDay: 1,
    dateClick: function () { console.log(23) },
    //eventClick: function(info){}
    eventClick: function (info) {


      alert('Event: ' + info.event.title);
      alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      alert('View: ' + info.view.type);

      // change the border color just for fun
      info.el.style.borderColor = 'red';
    },

    events: [
      {
        title: 'test',
        start: '2020-12-20',
        color: 'grey'
      }
    ]
  };

  constructor(private req: RequestService, public jwtHelper: JwtHelperService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadPersone();
    this.index = JSON.parse(localStorage.getItem("ProfileTabIdx"));

    console.log(1232)

    const helper = new JwtHelperService();
    // const decodedToken = helper.decodeToken(localStorage.getItem('tokenID'));
    //console.log(decodedToken);
    var date = new Date();
    // console.log(date.getMilliseconds()+1000*60*60);
    if (this.jwtHelper.isTokenExpired(localStorage.getItem('tokenID'), date.getMilliseconds())) {
      localStorage.removeItem('tokenID');
      this.router.navigate(['']);
    }


    this.addEvent();
  }


  addWorkout() {
    this.workouts.push({
      id: this.workouts.length + 1,
      name: '',
      reps: '',
      sets: '',
      weight: '',
      time: ''
    });
  }

  removeWorkout(i: number) {
    this.workouts.splice(i, 1);
  }

  logValue() {
    let usern: String = this.userI.user_username;
    this.user.date.month = this.user.date.month - 1;
    let mdate: String = moment(this.user.date).format('YYYY-MM-DD');
    this.workouts.map(function (item) {
      delete item.id;
      return item;
    });

    let programP: Program = new Program(this.user.id, usern, this.user.type, mdate, this.user.color, this.workouts);

    this.req.subProgram(programP).subscribe(
      (data: any) => {
        this.isRequestSuccess = true;
        setTimeout(() => this.isRequestSuccess = false, 3000);
        //if(this.programP.images!=null )  this.addphoto(dir.id);
      },
      (err: HttpErrorResponse) => {
        this.isRequestError = true;
        setTimeout(() => this.isRequestError = false, 2500);
      });

    this.modalService.dismissAll('Save click');

    location.reload();

    this.calendarOptions.dateClick = function (info) {
      console.log(2321113)
    }


  }


  addEvent() {

    this.req.getmyPrograms().subscribe(
      data => {
        var arr: EventData[] = [];
        data.map(
          e => {
            arr.push({ title: e.type, start: e.date, color: e.color });
          }
        );
        if (arr.length == 0) {
          alert("Welcome! Try adding a new program on the calendar!");
        }
        this.ELEMENT_DATA = arr;
        this.calendarOptions.events = this.ELEMENT_DATA;
      }, (err: HttpErrorResponse) => { console.log(err) }

    );

  }
  open(content) {
    this.user.id = uuid.v4();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  goToDay() {
    setTimeout(() => {
      console.log(this.router)

      this.router.navigate(['/day'])
    }, 300);
  }

  getPersoneInfo() {
    var us = localStorage.getItem("username");
    //   console.log(us);
    const body = new username();
    body.username = us;
    //  console.log(body);

    this.req.getUserInfo(body).subscribe(

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

  loadPersone() {
    const st = localStorage.getItem("userInfo");

    if (st == "{}" || st == null) {
      this.getPersoneInfo();

    }
    else this.userI = JSON.parse(st);

    this.picSrc = localStorage.getItem(this.picSrc)
    //if(this.picSrc==""|| this.picSrc=="{}"||this.picSrc==null) this.getPersoneProPic();

    setTimeout(() => 200);
  }

  savePersone() {
    localStorage.setItem("userInfo", JSON.stringify(this.userI));
  }



}


