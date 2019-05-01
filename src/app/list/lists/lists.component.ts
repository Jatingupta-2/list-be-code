import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../item.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  constructor(private apps: AppService, private socket: SocketService, private _route: ActivatedRoute, private router: Router, private items: ItemService, private toastr: ToastrService) { }

  public lists;
  public listId;
  public editedlist;
  public userId;
  public listName;
  public item = []


  ngOnInit() {


    this.verifyToken()
    setInterval(() => { this.verifyToken(); }, 10000)

    this.userId = this._route.snapshot.paramMap.get('userId');
    this.getAllItems();
    this.getEmitResponse();


  }

  verifyToken(): void {
    if (this.apps.getUserInfo() == null || this.apps.getUserInfo() == '' || !this.apps.getUserInfo()) { this.router.navigate(['']) }
    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || !Cookie.get('authToken')) { this.router.navigate(['']) }

  }

  getAllItems(): any {

    this.items.getList(this.userId).subscribe(
      (apiResponse) => {
        
          console.log(apiResponse.data)
          this.lists = apiResponse.data
          console.log(this.lists)
        
        
      },
      err => {
        this.toastr.error("Some Error Occurred " + err);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);

      }
    )

  }

  public getEmitResponse = () => {
    let id = this.userId + "edit"
    this.socket.editEmitResponse(id).subscribe((data) => {


      this.toastr.success(data)
      this.getAllItems();


    })
  }



  addList(): any {
    let data = {
      userId: this.userId,
      item: '',
      listName: "A new List"
    }
    this.items.addList(data).subscribe(
      apiResponse => {
        if (apiResponse.status == 200) {
          console.log(apiResponse)
          this.toastr.success("List Edited Successfully!!");
          this.getAllItems()
          let data1 = {
            userId: this.userId,
            message: "New List is added by " + Cookie.get("receiverName")
          }
          this.socket.editEmit(data1)

        }

        else {
          console.log(apiResponse);
          this.toastr.error("Failed " + apiResponse.message);
          setTimeout(() => {
            this.router.navigate(['/error500']);
          }, 2000);

        }
      },
      err => {
        this.toastr.error("Some Error Occurred " + err);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);

      }
    )
  }





  public changePass = () => {
    this.router.navigate(['/changePass'])
  }

  public logout = () => {
    this.apps.logout().subscribe(
      (apiResponse) => {

        if (apiResponse.status == 200) {
          Cookie.delete('receiverName')
          Cookie.delete('receiverId')
          Cookie.delete('authToken')
          this.apps.setUserInfo('')
          this.router.navigate([''])
          this.toastr.success("Logged Out Successfully")
        }
        else {
          console.log(apiResponse);
          this.toastr.error("logout Failed " + apiResponse.message);
          setTimeout(() => {
            this.router.navigate(['/error500']);
          }, 2000);

        }

      },
      (error) => {
        this.toastr.error("Some Error Occurred " + error);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);

      }


    )
  }


}
