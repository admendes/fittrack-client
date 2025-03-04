import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { RequestService } from '../services/RequestService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isRegError : boolean = false;

  constructor(private request:RequestService,private router:Router) { }

  ngOnInit(): void {
  }

  key = <any>'';
  
  onSubmit(UserName,Password,Email,Name,Confirmation){
  
    if(Password===Confirmation){
    const body={
      username:UserName,
      name:Name,
      password:Password,
      email:Email
    }
    this.isRegError = true;
    this.request.userRegister(body).subscribe((data : any)=>{
     
      localStorage.setItem('username',body.username); 
      localStorage.setItem('password',body.password);

      setTimeout( () => this.router.navigate(['/user']) , 300 );

   },
   (err : HttpErrorResponse)=>{
     this.isRegError = true;
     alert('Error registering user!');
     setTimeout(()=>this.isRegError = false,1000);
   });
  }else{
    alert('Passwords do not match!');

    console.log('error on logIn');
  }
  this.goToLogin();
 }


 goToLogin() {
  setTimeout( () => {
    console.log(this.router)

    this.router.navigate(['']) 
  }, 300 ); 
}
}
