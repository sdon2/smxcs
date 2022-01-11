import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { UsersComponent } from 'src/app/views/users/users.component';
import { UserAddComponent } from 'src/app/views/user-add/user-add.component';
import { UserEditComponent } from 'src/app/views/user-edit/user-edit.component';

import { AccessLevels } from './access-levels';

export const UserRoutes = {
    path: 'users',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: UsersComponent,
            data: {
                title: 'Users',
                accessLevel: AccessLevels.Owner
            }
        },
        {
            path: 'add',
            component: UserAddComponent,
            data: {
                title: 'Add User',
                accessLevel: AccessLevels.Owner
            }
        },
        {
            path: 'edit/:id',
            component: UserEditComponent,
            data: {
                title: 'Edit User',
                accessLevel: AccessLevels.Owner
            }
        }
    ]
};
