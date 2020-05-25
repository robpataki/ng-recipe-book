import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs';

import { User } from '../shared/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  usersChangedSub: Subscription;
  users: User[];

  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.users = this.usersService.getUsers();

    this.usersChangedSub = this.usersService.usersChanged.subscribe(users => {
      this.users = users;
    });
  }

  ngOnDestroy(): void {
    this.usersChangedSub.unsubscribe();
  }

}
