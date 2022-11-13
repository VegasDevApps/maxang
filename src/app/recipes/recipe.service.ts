import { EventEmitter, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService {

    recipeChanged = new Subject<Recipe[]>();

    private recipes: Recipe[] = [];
    private recipes_old: Recipe[] = [
        new Recipe(
            'A test recipe 1',
            'This is simply a test 1',
            'https://www.seriouseats.com/thmb/lBAvOl5D32f_fge1kx8Asver10Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/butter-basted-pan-seared-steaks-recipe-hero-06-03b1131c58524be2bd6c9851a2fbdbc3.jpg',
            [new Ingredient('meat', 1),
                new Ingredient('french fries', 20)]
        ),
        new Recipe('A test recipe 2',
            'This is simply a test 2',
            'https://www.seriouseats.com/thmb/lBAvOl5D32f_fge1kx8Asver10Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/butter-basted-pan-seared-steaks-recipe-hero-06-03b1131c58524be2bd6c9851a2fbdbc3.jpg',
            [new Ingredient('buns', 2),
                new Ingredient('meat', 1)]
        ),
        new Recipe('A test recipe 3',
            'This is simply a test 3',
            'https://www.seriouseats.com/thmb/lBAvOl5D32f_fge1kx8Asver10Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/butter-basted-pan-seared-steaks-recipe-hero-06-03b1131c58524be2bd6c9851a2fbdbc3.jpg',
            [new Ingredient('ananas', 2),
                new Ingredient('melon', 1)]
        )
    ];

    constructor(private shoppingListService: ShoppingListService){}

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
    }

    getRecipes() {
        return this.recipes.slice();
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients); 
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, recipe: Recipe){
        console.log('Privet');
        this.recipes[index] = recipe;
        this.recipeChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number){
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
    }
}