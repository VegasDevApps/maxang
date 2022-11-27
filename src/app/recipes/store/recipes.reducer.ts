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
        default:
            return state;
    }
}