import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpHeaders, HttpErrorResponse, HttpParams, HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private url = "http://api.jatingupta.xyz"
  private socket;


  constructor(private http: HttpClient) {
    this.socket = io(this.url)
  }

  public sendRequest = (data) => {
    this.socket.emit('send-req', data)
  }
  public acceptReject = (data) => {
    this.socket.emit('accept-reject', data)
  }

  public getRequest = (userId) => {
    return Observable.create(
      (Observer) => {
        this.socket.on(userId, (data) => {
          Observer.next(data)
        })
      }
    )
  }

  public acceptRejectResponse = (userId) => {

    return Observable.create(
      (Observer) => {
        this.socket.on(userId, (data) => {
          Observer.next(data)
        })
      }
    )

  }


  public editEmit = (data) => {
    this.socket.emit('editEmit', data)
  }


  public editEmitResponse = (userId) => {
    return Observable.create(
      (Observer) => {
        this.socket.on(userId, (data) => {
          Observer.next(data)
        })
      }
    )
  }


}
