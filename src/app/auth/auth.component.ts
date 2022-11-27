import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styles: []
})
export class AuthComponent implements OnDestroy, OnInit {

    constructor(private store: Store<fromApp.AppState>){}

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective;
    private closeSubscribtion: Subscription;
    private storeSub: Subscription;

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading; 
            this.error = authState.authError;
            if (this.error) {
                this.showErrorAlert(this.error);
            }
        });
    }

    onSubmit(form: NgForm) {
        
        if (!form.valid) {
            return;
        }

        const { email, password } = form.value;

        if (this.isLoginMode) {
           this.store.dispatch(new AuthActions.LoginStart({email, password}));
        } else {
            this.store.dispatch(new AuthActions.SignupStart({ email, password }));
        }        
        form.reset();
    }

    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError());
    }

    private showErrorAlert(message: string){
       
        const hostViewContainerRef = this.alertHost.viewContainerRef;

        hostViewContainerRef.clear();
        const componentRef = hostViewContainerRef.createComponent(AlertComponent);

        componentRef.instance.message = message;
        this.closeSubscribtion = componentRef.instance.close.subscribe(() => {
            this.closeSubscribtion.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy(): void {
        if(this.closeSubscribtion)
        { this.closeSubscribtion.unsubscribe(); }
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}