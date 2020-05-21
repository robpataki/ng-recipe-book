import { Ingredient } from '../shared/ingredient.model';
import { Subject } from 'rxjs';

export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  setIngredients(ingredients: Ingredient[]): void {
    this.ingredients = ingredients;
    this.emitIngredientsChanged();
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    this.emitIngredientsChanged();
  }

  addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.emitIngredientsChanged();
  }

  updateIngredient(index: number, newIngredient: Ingredient): void {
    this.ingredients[index] = newIngredient;
    this.emitIngredientsChanged();
  }

  deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.emitIngredientsChanged();
  }

  reset(): void {
    this.ingredients = [];
  }

  emitIngredientsChanged(): void {
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
