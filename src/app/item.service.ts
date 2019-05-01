import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private url = 'http://api.jatingupta.xyz';
  constructor(private http: HttpClient) { }


  public getAllItems = (listId): Observable<any> => {

    const p = new HttpParams()
      .set('listId', listId)

    return (this.http.post(`${this.url}/api/v1/items/view/all`, p))
  }


  public getList = (userId): Observable<any> => {

    const p = new HttpParams()
      .set('userId', userId)

    return (this.http.post(`${this.url}/api/v1/items/viewList`, p))
  }



  public addList = (data): Observable<any> => {

    const p = new HttpParams()
      .set('userId', data.userId)
      .set('listName',data.listName)
      

    return (this.http.post(`${this.url}/api/v1/items/add`, p))
  }

  public addEvent = (data): Observable<any> => {
    const p = new HttpParams()

      //add List Item ID Here
      .set('listId', '1')
      .set('name', data.name)
      .set('open', 'true')




    return this.http.post(`${this.url}/api/v1/items/add`, p);
  }


  public editEvent = (listId, userId, listName, list): Observable<any> => {

    let data = {
      listId: listId,
      userId: userId,
      listName: listName,
      item: list
    }

    //add List Item ID Here
    console.log(data)


    return this.http.put(`${this.url}/api/v1/items/edit`, data);
  }


  public undo = (listId): Observable<any> => {

    let data = {
      listId: listId
    }

    //add List Item ID Here



    return this.http.put(`${this.url}/api/v1/items/undo`, data);
  }



}
