import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, Observable, Subject, tap, throwError } from "rxjs";
import { User } from "./user.model";

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

    constructor(private http: HttpClient) {}

    user = new BehaviorSubject<User>(null);

    signup(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDbD0byEVO9ltiAwKgd_gilcZ3XVagcno0',
            { email, password, returnSecureToken: true })
            .pipe(catchError(this.handlerError), tap(response => {
                this.handleLogUser(response.email, response.localId, response.idToken, +response.expiresIn);
            }));
    }

    login(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDbD0byEVO9ltiAwKgd_gilcZ3XVagcno0',
            { email, password, returnSecureToken: true })
            .pipe(catchError(this.handlerError), tap(response => {
                this.handleLogUser(response.email, response.localId, response.idToken, +response.expiresIn);
            }));
    }

    private handleLogUser(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
                const user = new User(email, localId, idToken, expirationDate);
                this.user.next(user);
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