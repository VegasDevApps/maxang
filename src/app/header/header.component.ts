import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer';
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
        this.dataStorage.storeRecipes();
    }

    onFetchData() {
        this.dataStorage.fetchData().subscribe();
    }

    onLogout(){
        this.authService.logout();
    }
}