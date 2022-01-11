import { Injectable } from '@angular/core';
import { Consignor } from 'src/app/models/consignor';
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
export class SettingService extends AppService {

    apiRoot = `${Config.ApiRoot}/settings`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    getSetting(param: { name: string }): Observable<any> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, param));
    }

    saveSetting(params: { name: string, data: any }): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/save`, params));
    }
}
