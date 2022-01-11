import { Injectable } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/models/api.result';
import { Config } from 'src/app/app.config';
import { AppService } from './appservice';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class VehicleService extends AppService {

    apiRoot = `${Config.ApiRoot}/vehicles`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    getVehicles(): Observable<Vehicle[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`));
    }

    saveVehicle(vehicle: Vehicle): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, vehicle));
    }
}
