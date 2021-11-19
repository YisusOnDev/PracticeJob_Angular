import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../_models/company';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentCompanySubject: BehaviorSubject<Company>;
    public currentCompany: Observable<Company>;

    constructor(private http: HttpClient) {
        this.currentCompanySubject = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('currentCompany')!));
        this.currentCompany = this.currentCompanySubject.asObservable();
    }

    public get currentCompanyValue(): Company {
        return this.currentCompanySubject.value;
    }

    login(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Auth/Login`, { email, password, 'loginType':'Company' }, {headers})
            .pipe(map(company => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentCompany', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentCompany');
        this.currentCompanySubject.next(null!);
    }
}