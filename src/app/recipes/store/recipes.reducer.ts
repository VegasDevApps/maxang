import { Recipe } from "../recipe.model";
import * as fromApp from '../../store/app.reducer';
import * as RecipesActions from './recipes.actions';


export interface State{
    recipes: Recipe[];
}

const initialState: State = {
    recipes: []
}

export function recipeReducer(state = initialState, action: RecipesActions.RecipesAction) {

    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            };
            case RecipesActions.ADD_RECIPE:
                return {
                    ...state,
                    recipes: [...state.recipes, action.payload]
                };
            case RecipesActions.UPDATE_RECIPE:
                const updatedRecipe = {...state.recipes[action.payload.id], ...action.payload.recipe};
                const updatedRecipes = [...state.recipes];
                updatedRecipes[action.payload.id] = updatedRecipe;
                return {
                        ...state,
                        recipes: updatedRecipes
                    };

            case RecipesActions.DELETE_RECIPE:
                return {
                    ...state,
                    recipes: state.recipes.filter((r,i) => i !== action.payload)
                };
        default:
            return state;
    }
}