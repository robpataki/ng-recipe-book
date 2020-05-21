import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  isUserAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => {
      this.isUserAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
