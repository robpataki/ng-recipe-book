import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {}

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipe(index: number): Recipe {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  setRecipes(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.emitRecipesChanged();
  }

  addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.emitRecipesChanged();
  }

  updateRecipe(index: number, newRecipe: Recipe): void {
    this.recipes[index] = newRecipe;
    this.emitRecipesChanged();
  }

  deleteRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.emitRecipesChanged();
  }

  reset(): void {
    this.recipes = [];
  }

  emitRecipesChanged(): void {
    this.recipesChanged.next(this.recipes.slice());
  }
}
