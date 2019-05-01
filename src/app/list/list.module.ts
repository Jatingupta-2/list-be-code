import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserslistComponent } from './userslist/userslist.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListsComponent } from './lists/lists.component';
import { FriendsComponent } from './friends/friends.component';

@NgModule({
  declarations: [UserslistComponent, ListsComponent, FriendsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'userslist/:listId',component:UserslistComponent},
      {path:'lists/:userId',component:ListsComponent},
      {path:'friends',component:FriendsComponent}
    ])
  ]
})
export class ListModule { }
