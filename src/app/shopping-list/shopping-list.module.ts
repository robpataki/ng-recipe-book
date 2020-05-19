import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Router
import { ShoppingListRoutingModule } from './shopping-list-routing.module';

// Modules
import { SharedModule } from '../shared/shared.module';
// Components
import { ShoppingListComponent } from './shopping-list.component';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { LoggingService } from '../logging.service';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent
  ],
  imports: [
    ShoppingListRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ShoppingListModule {}