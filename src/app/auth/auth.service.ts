import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { environment } from "../../environments/environment";
import { Store } from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {

    constructor(private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>) {}

    //user = new BehaviorSubject<User>(null);
    private logoutTimer: any = null;

    signup(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ environment.fireBaseAPIKey }`,
            { email, password, returnSecureToken: true })
            .pipe(catchError(this.handlerError), tap(response => {
                this.handleLogUser(response.email, response.localId, response.idToken, +response.expiresIn);
            }));
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseAPIKey}`,
            { email, password, returnSecureToken: true })
            .pipe(catchError(this.handlerError), tap(response => {
                this.handleLogUser(response.email, response.localId, response.idToken, +response.expiresIn);
            }));
    }

    logout(){
        //this.user.next(null);
        this.store.dispatch(new AuthActions.Logout());
        this.router.navigate(['/']);
        localStorage.removeItem('userData');
        if(this.logoutTimer){
            clearTimeout(this.logoutTimer);
        }
        this.logoutTimer = null;
    }

    autoLogin(){

        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));
        
        if(!userData){
            return;
        }

        const expirationDate = new Date(userData._tokenExpirationDate);
        const user = new User(userData.email, userData.id, userData._token, expirationDate);

        if(user.token){
            //this.user.next(user);
            this.store.dispatch(new AuthActions.Login({ 
                email: user.email, userId: user.id, token: user.token, expirationDate: expirationDate 
            }));
            const expirationDuration = expirationDate.getTime() - new Date().getTime();
            this.autoLogout(expirationDuration)
        }
    }

    autoLogout(expirationDuration: number){
        this.logoutTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }


    private handleLogUser(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(email, localId, idToken, expirationDate);
        //this.user.next(user);
        this.store.dispatch(new AuthActions.Login({
            email: user.email,
            token: user.token,
            userId: user.id,
            expirationDate: expirationDate
        }));
        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handlerError(errorResponse: HttpErrorResponse) {
        let errMessage = 'An unknown error occured!';

        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(() => new Error(errMessage));
        }

        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errMessage = 'The email address is already in use by another account.';
                break;
            case 'EMAIL_NOT_FOUND':
                errMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
                break;
            case 'INVALID_PASSWORD':
                errMessage = 'The password is invalid or the user does not have a password.';
                break;
            case 'USER_DISABLED':
                errMessage = 'The user account has been disabled by an administrator.';
                break;
            default:
        }
        return throwError(() => new Error(errMessage));
    }
}