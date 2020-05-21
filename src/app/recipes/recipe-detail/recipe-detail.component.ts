import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe;
  id: number;
  isLoading: boolean = false;
  
  constructor(private recipeService: RecipeService,
              private dataStorageService: DataStorageService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.recipe = this.recipeService.getRecipe(this.id);
        }
      );
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  onAddToShoppingList(): void {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe(): void {
    this.recipeService.deleteRecipe(this.id);
    this.isLoading = true;
    this.dataStorageService.storeRecipes().subscribe(recipes => {
      this.router.navigate(['/recipes']);
    });
  }
}
