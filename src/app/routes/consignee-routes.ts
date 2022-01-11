import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { ConsigneesComponent } from 'src/app/views/consignees/consignees.component';
import { ConsigneeAddComponent } from 'src/app/views/consignee-add/consignee-add.component';
import { ConsigneeEditComponent } from 'src/app/views/consignee-edit/consignee-edit.component';

import { AccessLevels } from './access-levels';

export const ConsigneeRoutes = {
    path: 'consignees',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: ConsigneesComponent,
            data: {
                title: 'Consignees',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'add',
            component: ConsigneeAddComponent,
            data: {
                title: 'Add Consignee',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'edit/:id',
            component: ConsigneeEditComponent,
            data: {
                title: 'Edit Consignee',
                accessLevel: AccessLevels.Owner
            }
        }
    ]
};
