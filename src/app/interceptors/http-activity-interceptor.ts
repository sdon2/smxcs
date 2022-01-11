import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { HttpActivityService } from '../services/http-activity.service';

@Injectable()
export class HttpActivityInterceptor implements HttpInterceptor {

    constructor(private httpActivityService: HttpActivityService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const excludeInterceptor = request.headers.has('excludeInterceptor');
        if (excludeInterceptor) {
            const keys = request.headers.keys();
            const headers = new HttpHeaders();
            keys.forEach(key => {
                if (key != 'excludeInterceptor') {
                    headers.append(key, request.headers.get(key) ?? '');
                }
            });
            request = request.clone({ headers: headers });
        }

        if (!excludeInterceptor) { this.httpActivityService.setActivity(true); }
        return next.handle(request)
            .pipe(
                map(event => {
                    return event;
                }),
                catchError(error => {
                    if (!excludeInterceptor) { this.httpActivityService.setActivity(false); }
                    return throwError(error);
                }),
                finalize(() => {
                    if (!excludeInterceptor) { this.httpActivityService.setActivity(false); }
                }));
    }
}
