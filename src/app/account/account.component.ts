import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AccountService } from './account.service';
import { Account } from './account.model';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  accountForm: FormGroup;
  account: Account;
  accountChangedSub: Subscription;
  photoSelected: boolean = false;
  isLoading: boolean = false;

  constructor(private accountService: AccountService,
              private dataStorageService: DataStorageService,
              private authService: AuthService) {}

  private initForm() {
    let firstName = this.account.firstName;
    let lastName = this.account.lastName;
    let organisation = this.account.organisation;
    let photoUrl = this.account.photoUrl;
    let email = this.authService.email; // We don't want to submit email, only showing it on the page

    // Get existing data from Auth service (email), and account service (first name, last name)

    this.accountForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      profilePhoto: new FormControl(null),
      email: new FormControl({ value: email, disabled: true }, [Validators.required, Validators.email]),
      organisation: new FormControl(organisation, [Validators.required])
    });
  }

  ngOnInit(): void {
    this.account = this.accountService.getAccount();

    this.accountChangedSub = this.accountService.accountChanged
    .subscribe(
      (account: Account) => {
        this.account = account;

        this.dataStorageService.storeAccount().subscribe(account => {
          this.isLoading = false;
        });
      }
    );

    this.initForm();
  }

  ngOnDestroy(): void {
    this.isLoading = false;
    this.accountChangedSub.unsubscribe();
  }

  onSubmit(): void {
    this.isLoading = true;
    
    const account: Account = new Account(
      this.accountForm.value['firstName'],
      this.accountForm.value['lastName'],
      this.accountForm.value['organisation'],
      'photoUrl'
    );

    this.accountService.setAccount(account);
  }

  onReset(): void {
    this.accountForm.reset();
  }

  onPhotoSelected(event): void {
    console.log('File selected: ', event.target.files[0]);
    this.photoSelected = true;
  }

}
