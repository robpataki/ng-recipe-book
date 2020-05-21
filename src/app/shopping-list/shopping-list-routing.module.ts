import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from '../auth/auth.guard';
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingListResolverService } from './shopping-list-resolver.service';

const shoppingListRoutes: Routes = [
  { path: '',
    component: ShoppingListComponent,
    canActivate: [AuthGuard],
    resolve: [ShoppingListResolverService]
  }
];

@NgModule({
  imports: [RouterModule.forChild(shoppingListRoutes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {}