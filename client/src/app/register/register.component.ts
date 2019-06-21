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

  ngOnInit() {
  }

  register() {
    this._userService.signup(this.firstName, this.lastName, this.email, this.userCode, this.password, this.phoneNumber).toPromise()
    .then((response: any)=>{
      if(response.success === true) {
        this._router.navigate(['/']);
      }
    })
  }
}
