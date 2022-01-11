import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public jwtHelper: JwtHelperService, private tokenService: TokenService) { }


    private isValidToken(token: string) {
        return token && token != null && token.length > 10;
    }
    public isAuthenticated(): boolean {
        const token = this.tokenService.getAuthToken();
        if (!this.isValidToken(token)) { return false; }

        if (this.jwtHelper.isTokenExpired(token)) {
            this.tokenService.removeAuthToken();
            return false;
        }

        return true;
    }
}
