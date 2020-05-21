import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';

import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  static API_URL: string = 'https://ng-recipe-book-c3ee6.firebaseio.com/';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {}

  fetchRecipes() {
    // Get the user object from the service without having to unsubscribe
    return this.http.get<Recipe[]>(`${DataStorageService.API_URL}/recipes.json`)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
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
}
