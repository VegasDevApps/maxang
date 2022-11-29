import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import { map, withLatestFrom } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';
import * as fromApp from '../../store/app.reducer';
import { Store } from "@ngrx/store";


@Injectable({providedIn: "root"})
export class RecipesEffects {

    fetchRecipes = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.get<Recipe[]>(
                    'https://maxang-df23e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
                );
            }),
            map(res => {
                return res.map(rec => {
                    return {
                        ...rec,
                        ingredients: rec.ingredients ? rec.ingredients : []
                    };
                });
            }),
            map(recipes => {
                return new RecipesActions.SetRecipes(recipes);
            })
        );
    });

    storeRecipes = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([actionData, recipesState]) => {
                return this.http.put(
                    'https://maxang-df23e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
                    recipesState.recipes
                )
            })
        );
    }, {dispatch: false});

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) { }
    
}