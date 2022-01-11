import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from 'src/app/app.config';
import { ApiResult } from 'src/app/models/api.result';
import { Observable } from 'rxjs';
import { AppService } from './appservice';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends AppService {

    apiRoot = `${Config.ApiRoot}/users`;

    constructor(private http: HttpClient, public override router: Router, public override tokenService: TokenService) {
        super(router, tokenService);
    }

    login(user: User) {
        return this.returnResult(this.http.post<ApiResult>(`${Config.ApiRoot}/home/login`, user));
    }

    getUsers(): Observable<User[]> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}`));
    }

    getUser(id: number): Observable<User> {
        return this.returnResult(this.http.get<ApiResult>(`${this.apiRoot}/find/${id}`));
    }

    saveUser(user: User): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/create`, user));
    }

    updateUser(user: User): Observable<{ result: number, reLogin: boolean}> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/update`, user));
    }

    deleteUser(id: number): Observable<number> {
        return this.returnResult(this.http.post<ApiResult>(`${this.apiRoot}/delete`, { id: id }));
    }
}
