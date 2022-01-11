import { Injectable } from '@angular/core';
import { Consignment } from 'src/app/models/consignment';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/app.config';
import { ApiResult } from 'src/app/models/api.result';
import { Observable } from 'rxjs';
import { AppService } from './appservice';
import { Router } from '@angular/router';
import { ConsignmentStatus } from '../models/enums';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class ConsignmentService extends AppService {

    apiRoot = `${Config.ApiRoot}/consignments`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    searchConsignments(search: { text: string }): Observable<Consignment[]> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, search));
    }

    advancedSearchConsignments(search: any): Observable<any> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/advanced-search`, search));
    }

    getConsignments(offset: any = 0, limit: any = 100): Observable<Consignment[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`, { params: { 'offset': offset, 'limit': limit }}));
    }

    getConsignmentStats(): Observable<{ totalItems: number }> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/stats`));
    }

    getConsignment(id: number): Observable<Consignment> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/find/${id}`));
    }

    getUncompletedConsignments(): Observable<Consignment[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/uncompleted`));
    }

    saveConsignment(consignment: Consignment): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, consignment));
    }

    updateConsignment(consignment: Consignment): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update`, consignment));
    }

    deleteConsignment(id: number): Observable<boolean> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/delete`, { id: id }));
    }

    getNewLRNumber(): Observable<number> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/new-lr-id`));
    }

    setStatus(id: number, status: ConsignmentStatus): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update-status`, { id: id, status: status }));
    }
}
