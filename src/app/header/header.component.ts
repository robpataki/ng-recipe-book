import { Component, OnInit, OnDestroy } from '@angular/core';

import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isUserAuthenticated: boolean = false;

  constructor(private dataStorageService: DataStorageService,
              private authService: AuthService) {}

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => {
      this.isUserAuthenticated = !!user;

      console.log('[Header] - user: ', user, !user, !!user);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
