import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, finalize } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Ingredient } from './ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { AccountService } from '../account/account.service';
import { User } from './user.model';
import { UsersService } from '../users/users.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  API_URL: string = environment.firebaseConfig.databaseURL;

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private shoppingListService: ShoppingListService,
              private authService: AuthService,
              private accountService: AccountService,
              private usersService: UsersService) {}

  // TODO - REFACTOR `Account` to User
  fetchUser(): Observable<User> {
    const _userId = this.authService.userId;
    return this.http.get<User>(`${this.API_URL}/users/${_userId}.json`)
    .pipe(
      tap(user => {
        let userAccount = user;
        if (!user) {
          userAccount = new User('', '', '', '', '', '');
        }
        this.accountService.setAccount(userAccount);
      })
    );
  }

  storeUser(): Observable<User> {
    const _userId = this.authService.userId;
    const account = this.accountService.getAccount();
    return this.http.put<User>(`${this.API_URL}/users/${_userId}.json`, account);
  }

  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users.json`)
    .pipe(
      tap(users => {
        let _users = [];
        for (let r in users) {
          _users.push(new User(
            users[r].firstName, 
            users[r].lastName, 
            users[r].displayName, 
            users[r].organisation,
            users[r].email,
            users[r].photoUrl
          ));
        }
        this.usersService.setUsers(_users);
      })
    );
  }

  fetchRecipes(): Observable<Recipe[]> {
    const _userId = this.authService.userId;
    return this.http.get<Recipe[]>(`${this.API_URL}/${_userId}/recipes.json`)
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
      }),
      finalize(() => {
        console.log('Finalize, fetching recipes is DONE!');
      })
    );
  }

  storeRecipes(): Observable<Recipe[]> {
    const _userId = this.authService.userId;
    const recipes = this.recipeService.getRecipes();
    return this.http.put<Recipe[]>(`${this.API_URL}/${_userId}/recipes.json`, recipes);
  }

  fetchIngredients(): Observable<Ingredient[]> {
    const _userId = this.authService.userId;
    return this.http.get<Ingredient[]>(`${this.API_URL}/${_userId}/ingredients.json`)
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
    return this.http.put<Ingredient[]>(`${this.API_URL}/${_userId}/ingredients.json`, ingredients);
  }
}
