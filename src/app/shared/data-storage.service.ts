import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take, tap } from "rxjs/operators";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Injectable({ providedIn: "root" })
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipesService: RecipeService,
        private store: Store<fromApp.AppState>) { }
    
    storeRecipes() {
        const recipes = this.recipesService.getRecipes();
        this.http.put(
            'https://maxang-df23e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipes
        ).subscribe(response => {
            console.log(response);
        });
    }

    fetchData() {

        return this.store.select('auth').pipe(
            take(1), 
            map(authState => authState.user),
            exhaustMap(user => {
            return this.http.get<Recipe[]>(
                'https://maxang-df23e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json')
        }), map(res => {
                return res.map(rec => {
                    return {
                        ...rec,
                        ingredients: rec.ingredients ? rec.ingredients : []
                    };
                });
            })
            , tap((res) => {
                this.store.dispatch(new RecipesActions.SetRecipes(res));
            }));
    }
}