import { Action } from "@ngrx/store";
import { Recipe } from "../recipe.model";


export const SET_RECIPES = '[RECIPES] SET_RECIPES';
export const FETCH_RECIPES = '[RECIPES] FETCH_RECIPES';
export const ADD_RECIPE = '[RECIPES] ADD_RECIPE';
export const UPDATE_RECIPE = '[RECIPES] UPDATE_RECIPE';
export const DELETE_RECIPE = '[RECIPES] DELETE_RECIPE';

export class SetRecipes implements Action {
    readonly type = SET_RECIPES;
    
    constructor(public payload: Recipe[]) { }
}

export class FetchRecipes implements Action {
    readonly type = FETCH_RECIPES;
}

export class AddRecipe implements Action {
    readonly type = ADD_RECIPE;
    constructor(public payload: Recipe){}
}

export class UpdateRecipe implements Action {
    readonly type = UPDATE_RECIPE;
    constructor(public payload: {id: number, recipe: Recipe}){}
}

export class DeleteRecipe implements Action {
    readonly type = DELETE_RECIPE;
    constructor(public payload: number){}
}
export type RecipesAction =
    SetRecipes |
    FetchRecipes |
    AddRecipe |
    UpdateRecipe |
    DeleteRecipe;