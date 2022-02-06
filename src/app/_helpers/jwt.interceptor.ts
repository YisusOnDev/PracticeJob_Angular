import { LoaderService } from './../_services/loader.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/auth.service';
import { environment } from 'src/environments/environment';
import { finalize } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService, public loaderService: LoaderService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Show loading progress & ¿disable user actions?
        this.loaderService.isSpinnerLoading.next(true);

        // Add auth header with jwt if user is logged in and request is to the api url
        const currentCompany = this.authenticationService.currentCompanyValue;
        const currentToken = this.authenticationService.currentTokenValue
        const isLoggedIn = currentCompany  && currentToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentToken}`
                }
            });
        }

        return next.handle(request).pipe(
            finalize(
                () => {
                    // hide loading progress & ¿enable user actions?
                    this.loaderService.isSpinnerLoading.next(false);
                }
            )
        );
    }
}