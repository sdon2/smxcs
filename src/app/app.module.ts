import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HammerModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { SidebarLayoutComponent } from './layouts/sidebar-layout/sidebar-layout.component';
import { LoginComponent } from './views/login/login.component';
import { ConsignmentsComponent } from './views/consignments/consignments.component';
import { ConsignmentAddComponent } from './views/consignment-add/consignment-add.component';
import { ConsignmentEditComponent } from './views/consignment-edit/consignment-edit.component';
import { OgpListsComponent } from './views/ogp-lists/ogp-lists.component';
import { OgpListAddComponent } from './views/ogp-list-add/ogp-list-add.component';
import { OgpListViewComponent } from './views/ogp-list-view/ogp-list-view.component';
import { OgpListEditComponent } from './views/ogp-list-edit/ogp-list-edit.component';
import { SelectConsignmentsDialogComponent } from './common/select-consignments-dialog/select-consignments-dialog.component';
import { UsersComponent } from './views/users/users.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { PageTitleComponent } from './common/page-title/page-title.component';
import { AddCityDialogComponent } from './common/add-city-dialog/add-city-dialog.component';
import { AddVehicleDialogComponent } from './common/add-vehicle-dialog/add-vehicle-dialog.component';
import { AddCustomerDialogComponent } from './common/add-customer-dialog/add-customer-dialog.component';
import { ConsignorsComponent } from './views/consignors/consignors.component';
import { ConsigneesComponent } from './views/consignees/consignees.component';
import { ConsignorAddComponent } from './views/consignor-add/consignor-add.component';
import { ConsigneeAddComponent } from './views/consignee-add/consignee-add.component';
import { ConsignorEditComponent } from './views/consignor-edit/consignor-edit.component';
import { ConsigneeEditComponent } from './views/consignee-edit/consignee-edit.component';
import { ConsignmentViewComponent } from './views/consignment-view/consignment-view.component';
import { ConsignmentLogsComponent } from './views/consignment-logs/consignment-logs.component';
import { UserAddComponent } from './views/user-add/user-add.component';
import { UserEditComponent } from './views/user-edit/user-edit.component';
import { SearchConsignmentsComponent } from './views/search-consignments/search-consignments.component';

import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

import { HttpActivityInterceptor } from './interceptors/http-activity-interceptor';
import { HttpAuthInterceptor } from './interceptors/http-auth-interceptor';

import { CityService } from './services/city.service';
import { ConsignmentService } from './services/consignment.service';
import { DriverService } from './services/driver.service';
import { DialogService } from './services/dialog.service';
import { OGPListService } from './services/ogplist.service';
import { VehicleService } from './services/vehicle.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { JwtDecodeService } from './services/jwt.decode.service';
import { ConsignorService } from './services/consignor.service';
import { ConsigneeService } from './services/consignee.service';
import { ConsignmentLogService } from './services/consignment-log.service';
import { RoleService } from './services/role.service';
import { TokenService } from './services/token.service';
import { HttpActivityService } from './services/http-activity.service';
import { SettingService } from './services/setting.service';
import { SettingsComponent } from './views/settings/settings.component';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatDividerModule } from "@angular/material/divider";
import { MatInputModule } from "@angular/material/input";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatMenuModule } from "@angular/material/menu";
import { MatBadgeModule } from "@angular/material/badge";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from '@angular/material/expansion';
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { PostService } from './services/post.service';

export function jwtOptionsFactory(tokenService: TokenService) {
    return {
        tokenGetter: () => {
            return tokenService.getAuthToken();
        }
    };
}

@NgModule({
    declarations: [
        AppComponent,
        SidebarLayoutComponent,
        LoginComponent,
        ConsignmentsComponent,
        OgpListsComponent,
        UsersComponent,
        NotFoundComponent,
        PageTitleComponent,
        ConsignmentAddComponent,
        AddCityDialogComponent,
        AddVehicleDialogComponent,
        AddCustomerDialogComponent,
        OgpListAddComponent,
        OgpListViewComponent,
        OgpListEditComponent,
        ConsignmentViewComponent,
        ConsignmentEditComponent,
        SelectConsignmentsDialogComponent,
        ConsignmentLogsComponent,
        ConsignorsComponent,
        ConsigneesComponent,
        ConsignorAddComponent,
        ConsigneeAddComponent,
        ConsignorEditComponent,
        ConsigneeEditComponent,
        UserAddComponent,
        UserEditComponent,
        SettingsComponent,
        SearchConsignmentsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HammerModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatToolbarModule,
        MatNativeDateModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatCardModule,
        MatTableModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatGridListModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatDialogModule,
        MatPaginatorModule,
        MatChipsModule,
        MatMenuModule,
        MatBadgeModule,
        MatCheckboxModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        JwtModule.forRoot({
            jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [TokenService]
            }
        })
    ],
    entryComponents: [
        AddCityDialogComponent,
        AddVehicleDialogComponent,
        AddCustomerDialogComponent,
        SelectConsignmentsDialogComponent,
    ],
    providers: [
        AuthGuard,
        RoleGuard,
        CityService,
        ConsignmentService,
        ConsignmentLogService,
        ConsignorService,
        ConsigneeService,
        DriverService,
        DialogService,
        OGPListService,
        SettingService,
        VehicleService,
        AuthService,
        RoleService,
        UserService,
        JwtHelperService,
        JwtDecodeService,
        TokenService,
        HttpActivityService,
        PostService,

        HttpActivityInterceptor,
        HttpAuthInterceptor,
        { provide: MAT_DATE_LOCALE, useValue: 'en-IN' },
        { provide: HTTP_INTERCEPTORS, useClass: HttpActivityInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
