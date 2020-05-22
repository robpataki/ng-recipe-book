// Core imports
import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';
import { ReactiveFormsModule } from '@angular/forms';

// Router
import { AccountRoutingModule } from './account-routing.module';
// Components
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    AccountRoutingModule
  ]
})
export class AccountModule {}