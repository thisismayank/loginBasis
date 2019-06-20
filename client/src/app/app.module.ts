import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { UserService } from './user.service';
import { AuthService } from './auth.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'register', component: RegisterComponent },
      { path: 'login', component: LoginComponent },
    ])
  ],
  providers: [
    UserService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
