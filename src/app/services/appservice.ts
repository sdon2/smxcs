import { Observable, throwError } from 'rxjs';
import { ApiResult } from '../models/api.result';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from './token.service';

export abstract class AppService {
    constructor(public router: Router, public tokenService: TokenService) { }

    protected errorHandler(error: any): Observable<never> {
        return throwError(error.message || error.error || 'Server Error');
    }

    protected returnResult(data: Observable<ApiResult>): Observable<any> {
        return data
            .pipe(
                map<ApiResult, any>(data => {
                    if (data.status != 200) {
                        if (data.status == 401) {
                            this.tokenService.removeAuthToken();
                            return this.router.navigate(['login']);
                        }
                        throw { error: data.error };
                    }
                    return data.data;
                }),
                catchError(this.errorHandler));
    }
}
