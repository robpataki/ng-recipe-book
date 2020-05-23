// Core imports
import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Router
import { AccountRoutingModule } from './account-routing.module';
// Components
import { AccountComponent } from './account.component';
import { SharedModule } from '../shared/shared.module';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AccountComponent
  ],
  imports: [
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ]
})
export class AccountModule {}