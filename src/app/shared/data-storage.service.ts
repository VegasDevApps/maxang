import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";

@Injectable({ providedIn: "root" })
export class DataStorageService {
    constructor(
        private http: HttpClient,
        private recipesService: RecipeService) { }
    
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
        return this.http.get<Recipe[]>(
            'https://maxang-df23e-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        ).pipe(
            map(res => {
                return res.map(rec => {
                    return {
                        ...rec,
                        ingredients: rec.ingredients ? rec.ingredients : []
                    };
                });
            })
            , tap((res) => {
                this.recipesService.setRecipes(res);
            }));
    }
}