import { Action } from "@ngrx/store";


export const LOGIN_START = '[AUTH] LOGIN_START';
export const AUTO_LOGIN = '[AUTH] AUTO_LOGIN';
export const AUTHENTICATE_FAIL = '[AUTH] AUTHENTICATE_FAIL';
export const SIGNUP_START = '[AUTH] SIGNUP_START';
export const AUTHENTICATE_SUCCESS = '[AUTH] AUTHENTICATE_SUCCESS';
export const LOGOUT = '[AUTH] LOGOUT';
export const CLEAR_ERROR = '[AUTH] CLEAR_ERROR';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(public payload: {
        email: string;
        userId: string;
        token: string;
        expirationDate: Date;
    } ){}


}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
    constructor(public payload: string) {}
}

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor( public payload: { email: string, password: string }) {}
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: { email: string, password: string }) { }
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions =
    AuthenticateSuccess |
    Logout |
    LoginStart |
    AuthenticateFail |
    SignupStart |
    ClearError |
    AutoLogin;