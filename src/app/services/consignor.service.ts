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
export class ConsignorService extends AppService {

    apiRoot = `${Config.ApiRoot}/consignors`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    searchConsignors(search: { text: string }): Observable<Consignor[]> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, search));
    }

    getConsignors(offset: any = 0, limit: any = 100): Observable<Consignor[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`, { params: { 'offset': offset, 'limit': limit }}));
    }

    getConsignorsForConsignment(): Observable<Consignor[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/for-consignment`));
    }

    getConsignorStats(): Observable<{ totalItems: number }> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/stats`));
    }

    getConsignor(id: number): Observable<Consignor> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/find/${id}`));
    }

    saveConsignor(consignor: Consignor): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, consignor));
    }

    updateConsignor(consignor: Consignor): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update`, consignor));
    }

    deleteConsignor(id: number): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/delete`, { id: id }));
    }
}
