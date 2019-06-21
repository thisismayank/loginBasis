import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private baseUrl = 'http://localhost:3000';
  private baseUrl = 'login-basis.herokuapp.com';
  constructor(private _httpClient: HttpClient) { }

  public check(phoneNumber) {
    const path = `/check/${phoneNumber}`;
    return this._httpClient.get(this.baseUrl + path);
  }

  public login(phoneNumber, password) {
    const path = '/login';
    const body = {
      phoneNumber: Number(phoneNumber),
      password: password.toString()
    };
    return this._httpClient.post(this.baseUrl + path, body);
  }

  public signup(firstName, lastName, email, userCode, password, phoneNumber) {
    const path = '/signup';
    const body = {
      firstName: firstName.toString(),
      lastName: lastName.toString(),
      email: email.toString(),
      userCode: userCode.toString(),
      password: password.toString(),
      phoneNumber: Number(phoneNumber)
    };
    
    return this._httpClient.post(this.baseUrl + path, body);
  }

  public generateOTP(email, userCode) {
    const path = '/generateOTP';
    const body = {
      email: email.toString(),
      userCode: userCode.toString()
    };

    return this._httpClient.post(this.baseUrl + path, body);
  }

  public verifyOTP(otp, userCode) {
    const path = '/verifyOTP';
    const body = {
      otp: Number(otp),
      userCode: userCode.toString()
    };

    return this._httpClient.post(this.baseUrl + path, body);
  }

  public forgotPassword(userCode, email, password) {
    const path = '/forgotPassword';
    const body = {
      userCode: userCode.toString(),
      email: email.toString(),
      password: password.toString()
    };

    return this._httpClient.post(this.baseUrl + path, body);
  }

  public updatePassword(token, currentPassword, newPassword) {
    const path = '/updatePassword';
    const body = {
      token: token,
      currentPassword: currentPassword.toString(),
      newPassword: newPassword.toString()
    };

    return this._httpClient.post(this.baseUrl + path, body);
  }
}
