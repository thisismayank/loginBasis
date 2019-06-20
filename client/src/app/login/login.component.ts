import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

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

  loggedIn: boolean;
  ngOnInit() {
    this.loggedIn = false;
  }

  login() {

  }
}
