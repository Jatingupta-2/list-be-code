import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ChangepassComponent } from './changepass/changepass.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocketService } from '../socket.service';

@NgModule({
  declarations: [LoginComponent, SignupComponent, ChangepassComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'changePass',component:ChangepassComponent}
    ])
  ],
  providers:[SocketService]
})
export class UserModule { }
