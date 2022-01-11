import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';

import { AccessLevels } from './access-levels';
import { SearchConsignmentsComponent } from '../views/search-consignments/search-consignments.component';

export const SearchConsignmentRoutes = {
    path: 'search-consignments',
    component: SidebarLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [RoleGuard],
    children: [
        {
            path: '',
            component: SearchConsignmentsComponent,
            data: {
                title: 'Search Consignments',
                accessLevel: AccessLevels.Accountant
            }
        }
    ]
};
