import { NgModule } from '@angular/core';

// Router
import { UsersRoutingModule } from './users-routing.module';
// Modules
import { SharedModule } from '../shared/shared.module';
// Components
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {}