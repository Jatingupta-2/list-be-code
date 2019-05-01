import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import{Cookie} from 'ng2-cookies/ng2-cookies'

@Component({
  selector: 'app-changepass',
  templateUrl: './changepass.component.html',
  styleUrls: ['./changepass.component.css']
})
export class ChangepassComponent implements OnInit {
  public newPassword:any;
  constructor(private apps:AppService,private toastr:ToastrService,private router:Router) { }

  ngOnInit() {this.verifyToken()
  }
  verifyToken():void{
    if(this.apps.getUserInfo()==null||this.apps.getUserInfo()==''||!this.apps.getUserInfo())
    {this.router.navigate([''])}
    if(Cookie.get('authToken')==null||Cookie.get('authToken')==''||!Cookie.get('authToken'))
    {this.router.navigate([''])}
    
  }



  public logout=()=>{
    this.apps.logout().subscribe(
      (apiResponse)=>{
        
        
        Cookie.delete('receiverName')
        Cookie.delete('receiverId')
        Cookie.delete('authToken')
        this.apps.setUserInfo('')
        this.router.navigate([''])
        this.toastr.success("Logged Out Successfully")
      }
    )
  }



  editPassword(){
    if(!this.newPassword){
      this.toastr.warning("No Password")
    }
    else{
    let data={
      email:this.apps.getUserInfo().email,
      password:this.newPassword
    }
    
    this.apps.editPassword(data).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          this.toastr.success("Password Edited Successfully")
          console.log(apiResponse);
          setTimeout(()=>{this.router.navigate([''])},2000);

        }
        else {
          this.toastr.error("Cannot Edit Password")
        }

      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 0);
      }
    )}
    
  }

}