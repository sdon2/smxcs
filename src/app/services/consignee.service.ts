import { Injectable } from '@angular/core';
import { Consignee } from 'src/app/models/consignee';
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
export class ConsigneeService extends AppService {

    apiRoot = `${Config.ApiRoot}/consignees`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    searchConsignees(search: { text: string }): Observable<Consignee[]> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, search));
    }

    getConsignees(offset: any = 0, limit: any = 100): Observable<Consignee[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`, { params: { 'offset': offset, 'limit': limit }}));
    }

    getConsigneesForConsignment(): Observable<Consignee[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/for-consignment`));
    }

    getConsigneeStats(): Observable<{ totalItems: number }> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/stats`));
    }

    getConsignee(id: number): Observable<Consignee> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/find/${id}`));
    }

    saveConsignee(consignee: Consignee): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, consignee));
    }

    updateConsignee(consignee: Consignee): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update`, consignee));
    }

    deleteConsignee(id: number): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/delete`, { id: id }));
    }
}
