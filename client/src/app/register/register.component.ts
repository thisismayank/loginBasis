import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private _userService: UserService, private _authService: AuthService, private _router: Router) { }

  firstName: any;
  lastName: any;
  userCode: any;
  email: any;
  phoneNumber: any;
  password: any;

  errorMessage: any;
  emailErrorMessage: any;
  pwErrorMessage: any;
  otpErrorMessage: any;
  phoneNumberErrorMessage: any;

  error: boolean;
  emailError: boolean;
  pwError: boolean;
  otpError: boolean;
  phoneNumberError: boolean;

  ngOnInit() {
    this.errorMessage = '';
    this.emailErrorMessage = '';
    this.pwErrorMessage = '';
    this.otpErrorMessage = '';
    this.phoneNumberErrorMessage = '';
    

    this.error = false;
    this.emailError = false;
    this.pwError = false;
    this.otpError = false;
    this.phoneNumberError = false;
  }

  register() {
    let err = false; 
    if(!this.email || this.email === '') {
      err = true;
      this.emailError = true;
      this.emailErrorMessage = '* Please enter a value';
    }
    
    if(!this.password || this.password === '') {
      err = true;
      this.pwError = true;
      this.pwErrorMessage = '* Pleas enter a value';
    }

    if(!this.userCode || this.userCode === '') {
      err = true;
      this.error = true;
      this.errorMessage = '* Please enter a value';
    }

    if(!this.phoneNumber || this.phoneNumber === '' || this.phoneNumber.length !== 10) {
      err = true;
      this.phoneNumberError = true;
      this.phoneNumberErrorMessage = '* Please enter a value';
    }

    if(!err) {
      this._userService.signup(this.firstName, this.lastName, this.email, this.userCode, this.password, this.phoneNumber).toPromise()
      .then((response: any)=>{
        if(response.success === false && response.redirectTo === 'error') {
          this.phoneNumberError = true;
          this.error = true;
          this.errorMessage = '* Either UserCode/phoneNumber exists, please enter unique'
          this.phoneNumberErrorMessage = '* Either UserCode/phoneNumber exists, please enter unique';
        } else if(response.success === false && response.redirectTo === 'signup') {
          this._router.navigate(['/signup']);
        } else if(response.success === false && response.redirectTo === 'login') {
          this.otpError = true;
          this.otpErrorMessage = '* OTP not sent, please go to login page and goto forgot password option'
        } else {
          this.error = false;
          this.errorMessage = '';
          this._router.navigate(['/']);
        }
      })
    }
  }
}
