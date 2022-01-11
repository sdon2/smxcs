import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { ConsignorsComponent } from 'src/app/views/consignors/consignors.component';
import { ConsignorAddComponent } from 'src/app/views/consignor-add/consignor-add.component';
import { ConsignorEditComponent } from 'src/app/views/consignor-edit/consignor-edit.component';

import { AccessLevels } from './access-levels';

export const ConsignorRoutes = {
    path: 'consignors',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: ConsignorsComponent,
            data: {
                title: 'Consignors',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'add',
            component: ConsignorAddComponent,
            data: {
                title: 'Add Consignor',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'edit/:id',
            component: ConsignorEditComponent,
            data: {
                title: 'Edit Consignor',
                accessLevel: AccessLevels.Owner
            }
        }
    ]
};
