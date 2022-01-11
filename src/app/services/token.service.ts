import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    authTokenName = 'token';

    public getAuthToken() {
        return localStorage.getItem(this.authTokenName);
    }

    setAuthToken(authToken: string) {
        localStorage.setItem(this.authTokenName, authToken);
    }

    removeAuthToken() {
        localStorage.removeItem(this.authTokenName);
    }
}
