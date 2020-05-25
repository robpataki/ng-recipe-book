import { Injectable } from '@angular/core';
import {
  Resolve,
} from '@angular/router';

import { User } from '../shared/user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class AccountResolverService implements Resolve<User> {
  constructor(
    private dataStorageService: DataStorageService,
    private accountService: AccountService
  ) {}

  resolve() {
    const account = this.accountService.getAccount();
    console.log('[Account Resolver] - account: ', account);

    if (!account) {
      return this.dataStorageService.fetchUser();
    } else {
      return account;
    }
  }
}
