import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';
import { Store } from "@ngrx/store";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    private userSub: Subscription;
    isAuth = false;
    
    constructor(private dataStorage: DataStorageService, private authService: AuthService,
        private store: Store<fromApp.AppState>) { }
    
    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
    
    ngOnInit() {
        this.userSub = this.store.select('auth').pipe(
            map(authState => authState.user)).subscribe(user => {
            this.isAuth = !!user;
        });
    }

    onSaveData() {
        this.store.dispatch(new RecipesActions.StoreRecipes());
    }

    onFetchData() {
        this.store.dispatch(new RecipesActions.FetchRecipes());
    }

    onLogout(){
        this.store.dispatch(new AuthActions.Logout());
    }
}