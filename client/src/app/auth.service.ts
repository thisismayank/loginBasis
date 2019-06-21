import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:3000';
  constructor(private _httpClient: HttpClient, private _router: Router) { }

  public getToken() {
    return localStorage.getItem('token');
  }

  public verifyToken(token) {
    const path = `/verifyToken/${token}`;
    return this._httpClient.get(this.baseUrl + path);
  }

  public isLoggedIn() {
    let token = this.getToken();
    return this.verifyToken(token);
  }
}
