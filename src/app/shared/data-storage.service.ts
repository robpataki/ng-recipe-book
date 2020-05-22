import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AccountService } from '../account/account.service';
import { Account } from '../account/account.model';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  static API_URL: string = 'https://ng-recipe-book-c3ee6.firebaseio.com';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private shoppingListService: ShoppingListService,
              private authService: AuthService,
              private accountService: AccountService) {}

  fetchAccount(): Observable<Account> {
    const _userId = this.authService.userId;
    return this.http.get<Account>(`${DataStorageService.API_URL}/${_userId}/account.json`)
    .pipe(
      tap(account => {
        let userAccount = account;
        if (!account) {
          userAccount = new Account('', '', '', '');
        }
        this.accountService.setAccount(userAccount);
      })
    );
  }

  storeAccount(): Observable<Account> {
    const _userId = this.authService.userId;
    const account = this.accountService.getAccount();
    return this.http.put<Account>(`${DataStorageService.API_URL}/${_userId}/account.json`, account);
  }

  fetchRecipes(): Observable<Recipe[]> {
    const _userId = this.authService.userId;
    return this.http.get<Recipe[]>(`${DataStorageService.API_URL}/${_userId}/recipes.json`)
    .pipe(
      map(recipes => {
        if (!!recipes) {
          return recipes.map(recipe => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
          });
        }
        return [];
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }

  storeRecipes(): Observable<Recipe[]> {
    const _userId = this.authService.userId;
    const recipes = this.recipeService.getRecipes();
    return this.http.put<Recipe[]>(`${DataStorageService.API_URL}/${_userId}/recipes.json`, recipes);
  }

  fetchIngredients(): Observable<Ingredient[]> {
    const _userId = this.authService.userId;
    return this.http.get<Ingredient[]>(`${DataStorageService.API_URL}/${_userId}/ingredients.json`)
    .pipe(
      tap(ingredients => {
        const _ingredients = ingredients || [];
        this.shoppingListService.setIngredients(_ingredients);
      })
    );
  }

  storeIngredients(): Observable<Ingredient[]> {
    const _userId = this.authService.userId;
    const ingredients = this.shoppingListService.getIngredients();
    return this.http.put<Ingredient[]>(`${DataStorageService.API_URL}/${_userId}/ingredients.json`, ingredients);
  }
}
