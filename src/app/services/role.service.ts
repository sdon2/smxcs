import { Injectable } from '@angular/core';

import { JwtDecodeService } from './jwt.decode.service';
import { UserRole } from '../models/enums';

@Injectable({
    providedIn: 'root'
})
export class RoleService {

    constructor(private decodeService: JwtDecodeService) {}

    getRole(): UserRole {
        // decode the token to get its payload
        return this.decodeService.getFieldFromToken('role') as UserRole;
    }
}
