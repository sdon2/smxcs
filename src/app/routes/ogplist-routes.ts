import { AuthGuard } from 'src/app/guards/auth-guard';
import { RoleGuard } from 'src/app/guards/role-guard';

import { SidebarLayoutComponent } from 'src/app/layouts/sidebar-layout/sidebar-layout.component';
import { OgpListsComponent } from 'src/app/views/ogp-lists/ogp-lists.component';
import { OgpListAddComponent } from 'src/app/views/ogp-list-add/ogp-list-add.component';
import { OgpListViewComponent } from 'src/app/views/ogp-list-view/ogp-list-view.component';
import { OgpListEditComponent } from 'src/app/views/ogp-list-edit/ogp-list-edit.component';

import { AccessLevels } from './access-levels';

export const OGPListRoutes = {
    path: 'ogp-lists',
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
            component: OgpListsComponent,
            data: {
                title: 'OGP Lists',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'add',
            component: OgpListAddComponent,
            data: {
                title: 'Add OGP List',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'view/:id',
            component: OgpListViewComponent,
            data: {
                title: 'View OGP List',
                accessLevel: AccessLevels.Accountant
            }
        },
        {
            path: 'edit/:id',
            component: OgpListEditComponent,
            data: {
                title: 'Edit OGP List',
                accessLevel: AccessLevels.Accountant
            }
        }
    ]
};
