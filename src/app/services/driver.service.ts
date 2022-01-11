import { Injectable } from '@angular/core';
import { Driver } from 'src/app/models/driver';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/app.config';
import { ApiResult } from 'src/app/models/api.result';
import { Observable } from 'rxjs';
import { AppService } from './appservice';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class DriverService extends AppService {

    apiRoot = `${Config.ApiRoot}/drivers`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    getDrivers(): Observable<Driver[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`));
    }
}
