import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { RecipeService } from '../recipes/recipe.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AccountService } from '../account/account.service';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  AUTH_API_SIGNIN_URL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
  AUTH_API_SIGNUP_URL: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp';
  API_KEY: string = environment.firebaseAPIKey;

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  tokenExpirationTimer: any;
  _userId: string;
  _email: string;

  constructor(private http: HttpClient,
              private router: Router,
              private recipeService: RecipeService,
              private slService: ShoppingListService,
              private accountService: AccountService) {}

  get userId(): string {
    return this._userId;
  }

  get email(): string {
    return this._email;
  }

  signup(email: string, password: string): Observable<AuthResponseData> {
    const signupData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(
      this.AUTH_API_SIGNUP_URL, 
      signupData, 
      {
        params: {
          key: this.API_KEY
        }
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  login(email: string, password: string): Observable<AuthResponseData> {
    const loginData = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    return this.http.post<AuthResponseData>(
      this.AUTH_API_SIGNIN_URL, 
      loginData,
      {
        params: {
          key: this.API_KEY
        }
      }
    ).pipe(
      catchError(this.handleError),
      tap(resData => this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn))
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);

    // Remove the user Data from the persistent local storage
    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    // Clear the user data from memory
    this.recipeService.reset();
    this.slService.reset();
    this.accountService.reset();
  }

  autoLogin(): void {
    // Retrieve user session data from persistent storage
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    
    const loadedUser = new User(
      userData.email, 
      userData.id, 
      userData._token, 
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this._userId = loadedUser.id;
      this._email = loadedUser.email;
      
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number): void {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + (+expiresIn * 1000));
    const user = new User(email, localId, idToken, expirationDate);
    
    this._userId = localId;
    this._email = email;

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);

    // Save auth data in persistent storage
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
      
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }

    switch(errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email is already in use';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email is not registered';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'Wrong password!';
        break;
    }

    return throwError(errorMessage);
  }
}