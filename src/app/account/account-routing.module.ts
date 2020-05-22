import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AuthGuard } from '../auth/auth.guard';
import { AccountResolverService } from './account-resolver.service';

const accountRoutes: Routes = [
  { 
    path: '', 
    component: AccountComponent,
    canActivate: [AuthGuard],
    resolve: [AccountResolverService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(accountRoutes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}