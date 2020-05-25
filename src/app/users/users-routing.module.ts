import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { AuthGuard } from '../auth/auth.guard';
import { UsersResolverService } from './users-resolver.service';

const usersRoutes: Routes = [
  { path: '',
    component: UsersComponent,
    canActivate: [AuthGuard],
    resolve: [UsersResolverService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}