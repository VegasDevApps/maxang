import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];

    constructor( private store: Store<fromApp.AppState>) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
        //this.shoppingListService.addIngredients(ingredients);
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe){
        this.recipes[index] = recipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}