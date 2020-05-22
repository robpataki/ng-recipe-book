import { Injectable } from '@angular/core';
import { Account } from './account.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  account: Account;
  accountChanged: Subject<Account> = new Subject<Account>();

  getAccount(): Account {
    return this.account;
  }

  setAccount(account: Account): void {
    this.account = account;
    this.accountChanged.next(this.account);
  }

  reset():void {
    this.account = null;
  }
}