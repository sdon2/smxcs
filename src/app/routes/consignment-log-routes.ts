import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { ConsignmentLogsComponent } from 'src/app/views/consignment-logs/consignment-logs.component';

import { AccessLevels } from './access-levels';

export const ConsignmentLogRoutes = {
    path: 'consignment-logs',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: ConsignmentLogsComponent,
            data: {
                title: 'Consignment Logs',
                accessLevel: AccessLevels.Branch
            }
        }
    ]
};
