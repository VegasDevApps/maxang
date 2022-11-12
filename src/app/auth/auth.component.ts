import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styles: []
})
export class AuthComponent {

    constructor(private authService: AuthService, private router: Router){}

    isLoginMode = true;
    isLoading = false;
    error: string = null;

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
                this.error = err
            }
        });
        
        form.reset();
    }
}