import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from '@angular/router';
import { ItemService } from '../../item.service';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  constructor(private _route: ActivatedRoute, private router: Router, private items: ItemService, private apps: AppService, private toastr: ToastrService, private socket: SocketService) { }


  public users = []
  public myId: any;
  public myUser: any;
  public sentRequest = [];
  public receivedRequest = []
  public friends = [];
  public notFrnd = [];

  ngOnInit() {
    this.verifyToken()
    setInterval(() => { this.verifyToken(); }, 10000)
    this.myId = Cookie.get('receiverId')
    this.getAllUsers();


    this.notFriends(this.myId)
    this.getRequest()
    this.acceptRejectResponse();
  }
  verifyToken(): void {
    if (this.apps.getUserInfo() == null || this.apps.getUserInfo() == '' || !this.apps.getUserInfo()) { this.router.navigate(['']) }
    if (Cookie.get('authToken') == null || Cookie.get('authToken') == '' || !Cookie.get('authToken')) { this.router.navigate(['']) }

  }
  public getAllUsers = () => {

    this.apps.getAllUsers().subscribe(
      (apiResponse) => {

        if (apiResponse.status == 200) {
          this.users = apiResponse.data;
          this.notFrnd = apiResponse.data;

          for (let user of apiResponse.data) {

            if (user.userId == this.myId) {
              this.myUser = user
              this.sentRequest = user.sentRequests
              this.receivedRequest = user.receivedRequests
              this.friends = user.friends

            }
          }
          this.notFriends(this.myId);
        }

        else {
          console.log(apiResponse);
          this.toastr.error("Get All Users Failed " + apiResponse.message);
          setTimeout(() => {
            this.router.navigate(['/error500']);
          }, 2000);

        }
      },
      (err) => {
        this.toastr.error("Some Error Occurred " + err);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )

  }


  public notFriends = (id) => {

    this.apps.getAllUsers().subscribe(
      (apiResponse) => {

        if (apiResponse.status == 200) {

          this.notFrnd = apiResponse.data;

          for (let i = 0; i < this.notFrnd.length; i++) {
            // let value = true;

            for (let req in this.sentRequest) {
              if (this.sentRequest[req] == this.notFrnd[i].userId) {
                this.notFrnd.splice(i, 1)
              }

            }

            for (let req in this.receivedRequest) {
              if (this.receivedRequest[req] == this.notFrnd[i].userId) {
                this.notFrnd.splice(i, 1)
              }
            }

            for (let req in this.friends) {
              if (this.friends[req] == this.notFrnd[i].userId) {
                this.notFrnd.splice(i, 1)
              }
            }
          }
        }

        else {
          console.log(apiResponse);
          this.toastr.error("Failed " + apiResponse.message);
          setTimeout(() => {
            this.router.navigate(['/error500']);
          }, 2000);
        }
      },
      (err) => {
        this.toastr.error("Some Error Occurred " + err);
        setTimeout(() => {
          this.router.navigate(['/error404']);
        }, 2000);
      }
    )

  }

  public sendRequest = (receiverId) => {
    let data = {
      receiverId: receiverId,
      senderId: this.myId
    }
    this.socket.sendRequest(data)

  }

  public accept = (receiverId) => {
    let data = {
      receiverId: this.myId,
      senderId: receiverId,
      accept: true
    }
    this.socket.acceptReject(data)
  }
  public reject = (receiverId) => {
    let data = {
      receiverId: this.myId,
      senderId: receiverId,
      accept: false
    }
    this.socket.acceptReject(data)
  }

  public getRequest = () => {
    this.socket.getRequest(this.myId).subscribe((data) => {

      if (data.senderId == this.myId) {
        this.toastr.success(`Friend Request sent`)
        this.getAllUsers();
      }
      else {
        this.toastr.success(`Friend Request received`)
        this.getAllUsers();
      }
    })
  }


  public acceptRejectResponse = () => {
    let res = this.myId + "ar";
    this.socket.acceptRejectResponse(res).subscribe((data) => {
      let senderName;
      let receiverName;
      for (let user of this.users) {
        if (user.userId == data.senderId) {
          senderName = user.userName;
        }
        if (user.userId == data.receiverId) {
          receiverName = user.userName;
        }

      }
      if (data.accept == true) {
        if (data.senderId == this.myId) {
          this.toastr.success(`Request accepted by ${receiverName}`)
          this.getAllUsers();


        }
        else {
          this.toastr.success(`Request accepted of ${senderName}`)
          this.getAllUsers();
        }
      }
      else {
        if (data.senderId == this.myId) {

          this.toastr.success(`Request rejected by ${receiverName}`)
          this.getAllUsers();


        }
        else {
          this.toastr.success(`Request rejected of ${senderName}`)
          this.getAllUsers();
        }

      }
    })
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
          this.toastr.error("Log out Failed " + apiResponse.message);
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
