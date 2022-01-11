import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, CanActivateChild } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { RoleService } from 'src/app/services/role.service';

import { environment } from 'src/environments/environment';
import { RouteData } from 'src/app/routes/route-data';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

    constructor(public auth: AuthService,
        public router: Router,
        private roleService: RoleService) { }

    private processRoles(route: ActivatedRouteSnapshot) {
        try {
            // this will be passed from the route config
            // on the data property
            const expectedRoles = (route.data as RouteData).accessLevel;
            const role = this.roleService.getRole();
            const roleFound = expectedRoles.find(item => item == role);

            const authenticated = this.auth.isAuthenticated();
            // if(!environment.production) console.log(authenticated, roleFound);
            if (authenticated && roleFound) {
                return true;
            }

            throw null;
        } catch (error) {
            if (error && !environment.production) { console.log(error); }
            this.router.navigate(['login']);
            return false;
        }
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        return this.processRoles(route);
    }

    canActivateChild(route: ActivatedRouteSnapshot): boolean {
        return this.processRoles(route);
    }
}
