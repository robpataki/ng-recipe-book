import { Injectable } from '@angular/core';
import { User } from '../shared/user.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  account: User;
  accountChanged: Subject<User> = new Subject<User>();

  getAccount(): User {
    return this.account;
  }

  setAccount(account: User): void {
    this.account = account;
    this.accountChanged.next(this.account);
  }

  reset():void {
    this.account = null;
  }
}