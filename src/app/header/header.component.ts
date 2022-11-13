import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
    collapsed = true;
    private userSub: Subscription;
    isAuth = false;
    
    constructor(private dataStorage: DataStorageService, private authService: AuthService) { }
    
    ngOnDestroy() {
        this.userSub.unsubscribe();
    }
    
    ngOnInit() {
        this.userSub = this.authService.user.subscribe(user => {
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