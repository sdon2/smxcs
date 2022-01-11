import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { ConsignmentsComponent } from 'src/app/views/consignments/consignments.component';
import { ConsignmentAddComponent } from 'src/app/views/consignment-add/consignment-add.component';
import { ConsignmentViewComponent } from 'src/app/views/consignment-view/consignment-view.component';
import { ConsignmentEditComponent } from 'src/app/views/consignment-edit/consignment-edit.component';

import { AccessLevels } from './access-levels';

export const ConsignmentRoutes = {
    path: 'consignments',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'page/1'
        },
        {
            path: 'page/:page',
            component: ConsignmentsComponent,
            data: {
                title: 'Consignments',
                accessLevel: AccessLevels.Branch
            }
        },
        {
            path: 'add',
            component: ConsignmentAddComponent,
            data: {
                title: 'Add Consignment',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'view/:id',
            component: ConsignmentViewComponent,
            data: {
                title: 'View Consignment',
                accessLevel: AccessLevels.Branch
            }
        },
        {
            path: 'edit/:id',
            component: ConsignmentEditComponent,
            data: {
                title: 'Edit Consignment',
                accessLevel: AccessLevels.Accountant
            }
        }
    ]
};
