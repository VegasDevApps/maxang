import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { switchMap } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import * as RecipesActions from './recipes.actions';


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

    constructor(
        private actions$: Actions,
        private http: HttpClient
    ) { }
    
}