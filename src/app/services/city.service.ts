import { Injectable } from '@angular/core';
import { City } from 'src/app/models/city';
import { HttpClient } from '@angular/common/http';
import { ApiResult } from 'src/app/models/api.result';
import { Config } from 'src/app/app.config';
import { AppService } from './appservice';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class CityService extends AppService {

    apiRoot = `${Config.ApiRoot}/cities`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    getCities(): Observable<City[]> {
        return this.returnResult(this.http.get<ApiResult>(this.apiRoot));
    }

    saveCity(city: City): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, city));
    }
}
