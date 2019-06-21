import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _userService: UserService, private _authService: AuthService, private _router: Router) { }

  userCode: any;
  email: any;
  phoneNumber: any;
  password: any;
  otp: any;
  currentPassword: any;
  newPassword: any;
  error: any;

  loggedIn: boolean;
  passedCheck: boolean;
  emailVerificationPending: boolean;
  forgotPass: boolean;
  showVerifyOtp: boolean;
  showPasswordScreen: boolean;
  showPhoneNumberScreen: boolean;
  showUpdatePasswordScreen: boolean;
  ngOnInit() {
    this.showPhoneNumberScreen = true;
    this.showPasswordScreen = false;
    this.loggedIn = false;
    // this.passedCheck = false;
    this.emailVerificationPending = false;
    this.forgotPass = false;
    this.showVerifyOtp = false;
    this.showUpdatePasswordScreen = false;
  }

  check() {
    this._userService.check(this.phoneNumber).toPromise()
    .then((response: any) => {
      if(response.success === true) {
        if(response.redirectTo === 'otp') {
          this.showPhoneNumberScreen = false;
          this.showVerifyOtp = true;
          this.userCode = response.data.userCode;
          this.email = response.data.email;
        } else if(response.redirectTo === 'password') {
          this.showPhoneNumberScreen = false;
          this.showPasswordScreen = true;
        }

        // this.passedCheck = true;
      }
    })
  }

  login() {
    this._userService.login(this.phoneNumber, this.password).toPromise()
    .then((response: any) => {
      if(response.success === false) {
        if(response.redirectTo === 'signup') {
          this._router.navigate(['/signup'])
        } else if(response.redirectTo === 'email') {
          this.showPasswordScreen = false;
          this.emailVerificationPending = true;
        } else {
          this.error = 'Wrong username or password';
        }
      } else {
        localStorage.removeItem('token');
        localStorage.setItem('token', response.token);
        this._router.navigate(['/user'])
      }
    })
  }

  forgotPassword() {
    this._userService.forgotPassword(this.userCode, this.email, this.password).toPromise()
    .then((response:any) => {
      if(response.success === true) {
        this.showUpdatePasswordScreen = false;
        this.showPhoneNumberScreen = true;
      }

    })
  }

  showGenerateOTP() {
    this.forgotPass = true;
  }

  generateOTP() {
    this._userService.generateOTP(this.email, this.userCode).toPromise()
    .then((response: any) => {
      if(response.success === true) {
        this.forgotPass = false;
        this.showVerifyOtp = true;
      }
    })
  }

  verifyOTP() {
    this._userService.verifyOTP(this.otp, this.userCode).toPromise()
    .then((response: any) => {
      if(response.success === true) {
        this.showVerifyOtp = false;
        this.showPasswordScreen = false;
        this.showUpdatePasswordScreen = true;
      }
    })
  }
}
