import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from 'src/app/models/api.result';
import { Config } from 'src/app/app.config';
import { AppService } from './appservice';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ConsignmentLog } from 'src/app/models/consignment-log';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class ConsignmentLogService extends AppService {

    apiRoot = `${Config.ApiRoot}/consignment-logs`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    searchConsignmentLogs(search: { text: string }): Observable<ConsignmentLog[]> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, search));
    }

    getConsignmentLogs(offset: any = 0, limit: any = 100): Observable<ConsignmentLog[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`, { params: { 'offset': offset, 'limit': limit }}));
    }

    getConsignmentLogStats(): Observable<{ totalItems: number }> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/stats`));
    }
}
