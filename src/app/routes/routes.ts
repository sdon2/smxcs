import { Routes } from '@angular/router';
import { ConsignmentRoutes } from './consignment-routes';
import { ConsignmentLogRoutes } from './consignment-log-routes';
import { OGPListRoutes } from './ogplist-routes';
import { ConsignorRoutes } from './consignor-routes';
import { ConsigneeRoutes } from './consignee-routes';
import { UserRoutes } from './user-routes';
import { OtherRoutes } from './other-routes';

import { LoginComponent } from 'src/app/views/login/login.component';
import { NotFoundComponent } from 'src/app/views/not-found/not-found.component';
import { SearchConsignmentRoutes } from './search-consignment-routes';

export const routes: Routes = [
    // Entry point
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    // Login
    {
        path: 'login',
        component: LoginComponent,
        data: { title: 'Login' }
    },
    // Module routes
    ConsignmentRoutes,
    SearchConsignmentRoutes,
    OGPListRoutes,
    ConsignmentLogRoutes,
    ConsignorRoutes,
    ConsigneeRoutes,
    //BillRoutes,
    UserRoutes,
    OtherRoutes,
    // 404
    {
        path: '**',
        component: NotFoundComponent,
        data: { title: 'Not Found' }
    }
];
