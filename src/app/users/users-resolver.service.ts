import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { User } from '../shared/user.model';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UsersResolverService implements Resolve<User[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private usersService: UsersService
  ) {}

  resolve() {
    const users = this.usersService.getUsers();

    if (users.length === 0) {
      return this.dataStorageService.fetchUsers();
    } else {
      return users;
    }
  }
}
