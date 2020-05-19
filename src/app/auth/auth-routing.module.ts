import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { AuthComponent } from './auth.component';

const authRoutes: Routes = [
  { path: '', component: AuthComponent }
]

@NgModule({
  imports: [RouterModule.forChild(authRoutes)]
})
export class AuthRoutingModule {}