import { Component, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styles: []
})
export class AuthComponent implements OnDestroy {

    constructor(
        private authService: AuthService, 
        private router: Router){}

    isLoginMode = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective, { static: true }) alertHost: PlaceholderDirective;
    private closeSubscribtion: Subscription;

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        
        if (!form.valid) {
            return;
        }

        this.isLoading = true;
        const { email, password } = form.value;

        let authObs: Observable<AuthResponseData>;

        if (this.isLoginMode) {
           authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe({
            next: response => {
                this.isLoading = false
                this.router.navigate(['./recipes']);
            },
            error: err => {
                this.isLoading = false;
                console.log(err);
                //this.error = err
                this.showErrorAlert(err);
            }
        });
        
        form.reset();
    }

    onHandleError(){
        this.error = null;
    }

    private showErrorAlert(message: string){
       
        // Depricated, you can pass component type directly to host
        // const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
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
        {this.closeSubscribtion.unsubscribe();}
    }
}