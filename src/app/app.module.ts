import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './../app/user/signup/signup.component';
import { ErrorModule } from './../app/error/error.module';
import { Error404Component } from './error/error404/error404.component';
import { Error500Component } from './error/error500/error500.component';
import { ListModule } from './list/list.module';


@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    ErrorModule,
    UserModule, 
    ListModule,  
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([{
      path: 'login', component: LoginComponent
    },
    { path: '', pathMatch: 'full', redirectTo: 'login' }
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
