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
    this.token = this._authService.getToken();
    this.errorMessage = '';
    this._authService.isLoggedIn().toPromise()
    .then((response:any)=>{
      if(!response.success) {
        this._router.navigate(['/login']);
      } else {
        this.change = false;
      }
    });
  }

  currentPassword: any;
  newPassword: any;
  token: any;
  errorMessage: any;
  confirmPassword: any;

  change: boolean;

  toggle() {
    this.change = !this.change;
  }

  logout() {
    localStorage.removeItem('token');
    this._router.navigate(['/']);
  }

  updatePassword() {
    this.token = this._authService.getToken();
    if(this.newPassword !== this.confirmPassword) {
      this.errorMessage = `* Passwords don't match, please re-enter`;
    } else if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are mandatory, please enter something';
    }
    else {
      this.errorMessage = '';
      this._userService.updatePassword(this.token, this.currentPassword, this.newPassword).toPromise()
      .then((response: any)=>{
        if(response.status === true) {
          localStorage.removeItem('token');
          this._router.navigate(['/']);
        }
      })
    }
  } // end of updatePassword function

}
