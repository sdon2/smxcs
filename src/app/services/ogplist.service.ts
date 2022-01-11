import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/app.config';
import { ApiResult } from 'src/app/models/api.result';
import { Observable } from 'rxjs';
import { OGPList } from 'src/app/models/ogp-list';
import { AppService } from './appservice';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class OGPListService extends AppService {

    apiRoot = `${Config.ApiRoot}/ogplists`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    getOGPs(offset: any = 0, limit: any = 100): Observable<OGPList[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`, { params: { 'offset': offset, 'limit': limit }}));
    }

    searchOgpLists(data: { text: string }): Observable<OGPList[]> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/search`, data));
    }

    getOGPStats(): Observable<{ totalItems: number }> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/stats`));
    }

    getOGP(id: number): Observable<OGPList> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/find/${id}`));
    }

    saveOGPList(ogpList: OGPList) {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, ogpList));
    }

    updateOGPList(ogplist: OGPList) {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update`, ogplist));
    }

    deleteOGPList(id: number) {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/delete`, { id: id }));
    }
}
