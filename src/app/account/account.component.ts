import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';

import { AccountService } from './account.service';
import { User } from '../shared/user.model';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  @ViewChild('profilePhoto', {static: false}) photoInput: ElementRef<HTMLElement>;

  accountForm: FormGroup;
  account: User;
  accountChangedSub: Subscription;
  photoToUpload: File;
  isLoading: boolean = false;

  fileRef: AngularFireStorageReference;
  uploadPercent: Observable<number>;
  uploadComplete: boolean = false;

  constructor(private accountService: AccountService,
              private dataStorageService: DataStorageService,
              private authService: AuthService,
              private storage: AngularFireStorage) {}

  ngOnInit(): void {
    this.account = this.accountService.getAccount();

    this.accountChangedSub = this.accountService.accountChanged
    .subscribe(
      (account: User) => {
        this.account = account;

        this.dataStorageService.storeUser().subscribe(account => {
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

  private initForm() {
    let firstName = this.account.firstName;
    let lastName = this.account.lastName;
    let displayName = this.account.displayName;
    let organisation = this.account.organisation;
    let email = this.account.email || this.authService.email; // Load from auth data as default

    // Get existing data from Auth service (email), and account service (first name, last name)
    this.accountForm = new FormGroup({
      firstName: new FormControl(firstName, Validators.required),
      lastName: new FormControl(lastName, Validators.required),
      displayName: new FormControl(displayName, Validators.required),
      profilePhoto: new FormControl(null),
      email: new FormControl({ value: email, disabled: !!email }, [Validators.required, Validators.email]),
      organisation: new FormControl(organisation, [Validators.required])
    });
  }

  onSubmit(): void {
    this.isLoading = true;

    if (this.photoToUpload) {
      this.uploadFile(this.photoToUpload).subscribe((data) => {
        console.log('[Account Component] next(data) - data: ', data);
      }, (error) => {
        console.log('[Account Component] error(error) - error: ', error);
      }, () => {
        console.log('[Account Component] complete');
        this.fileRef.getDownloadURL().subscribe(downloadUrl => {
          console.log('Upload complete 2 - this: ', this);

          this.uploadComplete = true;
          this.photoToUpload = null;
          
          // Reset the value of the file input control
          this.accountForm.controls.profilePhoto.setValue('');
          
          this.storeAccount(downloadUrl);
        });
      });
    } else {
      this.storeAccount();
    }
  }

  storeAccount(newPhotoUrl?: string): void {
    const account: User = new User(
      this.accountForm.value['firstName'],
      this.accountForm.value['lastName'],
      this.accountForm.value['displayName'],
      this.accountForm.value['organisation'],
      this.accountForm.getRawValue()['email'],
      newPhotoUrl || this.account.photoUrl
    );

    this.accountService.setAccount(account);
  }

  onSelectPhoto(): void {
    (<HTMLElement>this.photoInput.nativeElement).click();
  }

  onPhotoChanged(event): void {
    this.photoToUpload = event.target.files[0];
  }
    
  uploadFile(file: File): Observable<UploadTaskSnapshot> {
    let extension = 'jpg';
    if (file.type !== 'image/jpeg') {
      extension = file.type.split('/')[1];
    }

    const userId = this.authService.userId;
    const timeStamp = new Date().getTime();
    const filePath = `images/profile-photos/${userId}/${timeStamp}.${extension}`;
    
    this.fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    return task.snapshotChanges();
  }
}
