import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth.service";
import { User } from "../user.model";
import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (email: string, expiresIn: number, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
        redirect: true
    });
};

const handleError = (errorResponse: any) => {
    let errMessage = 'An unknown error occured!';

    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errMessage));
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
    return of(new AuthActions.AuthenticateFail(errMessage));
};

@Injectable()
export class AuthEffects {


    authSignup = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupActions: AuthActions.SignupStart) => {
                const { email, password } = signupActions.payload;
                return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseAPIKey}`,
                    {
                        email,
                        password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                        return handleAuthentication(resData.email, +resData.expiresIn, resData.localId, resData.idToken);
                    }), catchError(errorResponse => {
                        return handleError(errorResponse);
                    }));
            })
        );
    });

    authLogin = createEffect(() => {
        
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseAPIKey}`,
                    { 
                        email: authData.payload.email, 
                        password: authData.payload.password, 
                        returnSecureToken: true 
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                        }),
                        map(resData => {
                        return handleAuthentication(resData.email, +resData.expiresIn, resData.localId, resData.idToken);
                    }), catchError(errorResponse => {
                        return handleError(errorResponse);
                    }));
            }),
        )       
    });

    authRedirect = createEffect(() => {
        return this.actions$.pipe(ofType(
            AuthActions.AUTHENTICATE_SUCCESS), tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                if (authSuccessAction.payload.redirect) {
                    this.router.navigate(['/']);
                }
        }));
    }, { dispatch: false });

    authLogout = createEffect(() => {
        return this.actions$.pipe(ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
        }))
    }, { dispatch: false });

    autoLogin = createEffect(() => {
        return this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string;
                    id: string;
                    _token: string;
                    _tokenExpirationDate: string;
                } = JSON.parse(localStorage.getItem('userData'));

                if (!userData) {
                    return { type: 'DUMMY' };
                }

                const expirationDate = new Date(userData._tokenExpirationDate);
                const user = new User(userData.email, userData.id, userData._token, expirationDate);

                if (user.token) {
                    //this.user.next(user);
                    const expirationDuration = expirationDate.getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return new AuthActions.AuthenticateSuccess({
                        email: user.email,
                        userId: user.id,
                        token: user.token,
                        expirationDate: expirationDate,
                        redirect: false
                    });
                }

                return { type: 'DUMMY' };
        }));
    });

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) { }    
}