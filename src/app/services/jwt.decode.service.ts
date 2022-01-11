import { Injectable } from '@angular/core';

import decode from 'jwt-decode';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class JwtDecodeService {

    constructor(private tokenService: TokenService) {}

    getFieldFromToken(fieldName: string) {
        const token = this.tokenService.getAuthToken();
        // decode the token to get its payload
        const tokenPayload = decode(token) as Object;
        return tokenPayload.hasOwnProperty(fieldName) ? tokenPayload[fieldName] : null;
    }

    getRoleFromToken() {
        const token = this.tokenService.getAuthToken();
        // decode the token to get its payload
        const tokenPayload = decode(token) as Object;
        return tokenPayload.hasOwnProperty('role') ? tokenPayload['role'] : null;
    }
}
