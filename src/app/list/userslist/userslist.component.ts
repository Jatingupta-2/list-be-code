import { Component, OnInit, HostListener } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../item.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';



@Component({
  selector: 'app-userslist',
  templateUrl: './userslist.component.html',
  styleUrls: ['./userslist.component.css']
})
export class UserslistComponent implements OnInit {

  constructor(private apps: AppService, private socket: SocketService, private _route: ActivatedRoute, private router: Router, private items: ItemService, private toastr: ToastrService) { }


  public list;
  public listId;
  public editedlist;
  public userId;
  public listName;


  ngOnInit() {

    this.listId = this._route.snapshot.paramMap.get('listId');

    this.verifyToken();
    setInterval(() => { this.verifyToken(); }, 10000)

    this.userId = Cookie.get('receiverId');
    this.getAllItems();
    this.getEmitResponse();


  }


  verifyToken(): void {
    if (this.apps.getUserInfo() == null || this.apps.getUserInfo() == '' || !this.apps.getUserInfo()) { this.router.navigate(['']) }
    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || !Cookie.get('authToken')) { this.router.navigate(['']) }

  }


  getAllItems(): any {

    this.items.getAllItems(this.listId).subscribe(
      (apiResponse) => {
        
          console.log(apiResponse.data)
          this.list = apiResponse.data.item
          this.listName = apiResponse.data.listName
          this.userId = apiResponse.data.userId
          console.log(this.list)
        
        
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


  trackByIndex(index: number, obj: any): any {
    return index;
  }

  updateopendone(id: number): any {
    for (let item of this.list) {
      if (item._id == id) {
        if (item.open == true) {
          item.open = false;
        }
        else {
          item.open = true
        }
      }
    }

  }



  edit(): any {

    this.items.editEvent(this.listId, this.userId, this.listName, this.list).subscribe(
      (apiResponse) => {
        if (apiResponse.status == 200) {
          console.log(apiResponse)
          this.toastr.success("List Edited Successfully!!");
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

    let data1 = {
      userId: this.userId,
      message: this.listName + " is edited by " + Cookie.get("receiverName")
    }
    this.socket.editEmit(data1)

  }

  @HostListener('window:keydown', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    if (($event.ctrlKey || $event.metaKey) && $event.keyCode == 90) {
      this.undo()
    }
  }

  undo(): any {

    this.items.undo(this.listId).subscribe(
      apiResponse => {

        if (apiResponse.status == 300) {
          this.toastr.success("No More Undo possible!!");
        }
        else {
          console.log(apiResponse)
          this.getAllItems()
          this.toastr.success("Undo Successfully!!");
        }
      },
      error => {
        this.toastr.error("Some Error Occurred " + error);

      }
    )


    let data1 = {
      userId: this.userId,
      message: this.listName + " is edited by " + Cookie.get("receiverName")
    }
    this.socket.editEmit(data1)


  }


  addItem(): any {
    let item = {

      name: "",
      open: true,
      subitems: []
    }
    this.list.push(item);
    this.items.editEvent(this.listId, this.userId, this.listName, this.list).subscribe(
      apiResponse => {
        console.log(apiResponse)
        this.getAllItems();
        let data1 = {
          userId: this.userId,
          message: "New Item is added by " + Cookie.get("receiverName") + " in the list " + this.listName
        }
        this.socket.editEmit(data1)
        this.toastr.success("Item Added Successfully!!");

      },
      error => {
        this.toastr.error("Some Error Occurred " + error);

      }
    )


  }




  addSubItem(id: number): any {
    for (let item of this.list) {

      if (item._id == id) {
        item.subitems.push("");
      }
    }

  }


  deleteItem(id: number): any {
    for (let item in this.list) {
      if (this.list[item]._id == id) {
        this.list.splice(item, 1)
      }
    }
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
