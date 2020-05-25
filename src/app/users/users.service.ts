import { User } from '../shared/user.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UsersService {
  users: User[] = [];
  usersChanged: Subject<User[]> = new Subject<User[]>();

  getUsers(): User[] {
    return this.users.slice();
  }

  setUsers(users: User[]): void {
    this.users = users;
    this.usersChanged.next(this.users.slice());
  }
}