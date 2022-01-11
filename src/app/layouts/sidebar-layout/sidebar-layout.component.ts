import { Router } from '@angular/router';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { DialogService } from 'src/app/services/dialog.service';
import { RoleService } from 'src/app/services/role.service';
import { UserRole } from 'src/app/models/enums';
import { JwtDecodeService } from 'src/app/services/jwt.decode.service';
import { MediaObserver } from '@angular/flex-layout';
import { TokenService } from 'src/app/services/token.service';

@Component({
    selector: 'app-sidebar-layout',
    templateUrl: './sidebar-layout.component.html',
    styleUrls: ['./sidebar-layout.component.scss']
})
export class SidebarLayoutComponent implements OnInit {

    @ViewChildren('drawer') dc: QueryList<MatSidenav>|null = null;

    private menus: { title: string, icon: string, link: string, expectedRoles: UserRole[], badge?: string }[] = [
        {
            title: 'Consignments',
            icon: 'list_alt',
            link: '/consignments',
            expectedRoles: [
                UserRole.Branch,
                UserRole.Accountant,
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Search',
            icon: 'search',
            link: '/search-consignments',
            expectedRoles: [
                UserRole.Accountant,
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'OGP Lists',
            icon: 'local_shipping',
            link: '/ogp-lists',
            expectedRoles: [
                UserRole.Accountant,
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Consignors',
            icon: 'account_circle',
            link: '/consignors',
            expectedRoles: [
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Consignees',
            icon: 'account_circle',
            link: '/consignees',
            expectedRoles: [
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Settings',
            icon: 'settings_applications',
            link: '/settings',
            expectedRoles: [
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Users',
            icon: 'group',
            link: '/users',
            expectedRoles: [
                UserRole.Owner,
                UserRole.Admin
            ]
        },
        {
            title: 'Logs',
            icon: 'list',
            link: '/consignment-logs',
            expectedRoles: [
                UserRole.Branch,
                UserRole.Accountant,
                UserRole.Owner,
                UserRole.Admin
            ]
        }
    ];

    role: UserRole|null = null;

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private jwtService: JwtDecodeService,
        public media: MediaObserver,
        private tokenService: TokenService,
        private roleService: RoleService) { }

    ngOnInit() {
        this.role = this.roleService.getRole();
    }

    get FilteredMenus() {
        return this.menus.filter(item => item.expectedRoles.find(role => role == this.role));
    }

    get user() {
        return this.jwtService.getFieldFromToken('fullname');
    }

    showMenu(roles: UserRole[]) {
        return roles.find(role => role == this.role);
    }

    logout() {
        this.dialogService.Confirm('Are you sure about logging out?')
            .then(result => {
                if (result.value) {
                    this.tokenService.removeAuthToken();
                    this.router.navigate(['login']);
                }
            });
    }
}
