import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(private _userService: UserService, private _authService: AuthService, private _router: Router ) { }

  ngOnInit() {
    this.change = false;
  }

  currentPassword: any;
  newPassword: any;
  token: any;

  change: boolean;

  toggle() {
    this.change = true;
  }
  updatePassword() {
    this.token = this._authService.getToken();
    this._userService.updatePassword(this.token, this.currentPassword, this.newPassword).toPromise()
    .then((response: any)=>{
      if(response.status === true) {
        localStorage.removeItem('token');
        this._router.navigate(['/']);
      }
    })
  }
}
