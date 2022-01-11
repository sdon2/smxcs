import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';

import { AccessLevels } from './access-levels';
import { SettingsComponent } from '../views/settings/settings.component';

export const OtherRoutes = {
    path: 'settings',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: SettingsComponent,
            data: {
                title: 'Users',
                accessLevel: AccessLevels.Owner
            }
        },
    ]
};
