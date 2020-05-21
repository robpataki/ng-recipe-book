import { Injectable } from '@angular/core';
import {
  Resolve
} from '@angular/router';

import { DataStorageService } from '../shared/data-storage.service';
import { ShoppingListService } from './shopping-list.service';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({ providedIn: 'root' })
export class ShoppingListResolverService implements Resolve<Ingredient[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private shoppingListService: ShoppingListService
  ) {}

  resolve() {
    const ingredients = this.shoppingListService.getIngredients();

    if (ingredients.length === 0) {
      return this.dataStorageService.fetchIngredients();
    } else {
      return ingredients;
    }
  }
}