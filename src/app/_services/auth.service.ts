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
    /**
     * Get current localStorage data from User
     */
    public get currentCompanyValue(): Company {
        return this.currentCompanySubject.value;
    }

    /**
     * API POST Request method that send a login request. If login is correct save data to localstorage (including jwt token)
     * @param email
     * @param password 
     * @returns Company Object
     */
    login(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Auth/Login`, { email, password, 'loginType': 'Company' }, { headers })
            .pipe(map(result => {
                // Map result to a company object with token
                var company = new Company(result.data.id, result.data.email, result.data.name, result.data.address, result.data.provinceId, result.data.province, result.token);

                // Store company details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentCompany', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    /**
     * API POST Request method that creates (if valid) a new company including jwt token
     * @param email 
     * @param password 
     * @returns Company Object
     */
    create(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Auth/Create`, { email, password, 'loginType': 'Company' }, { headers })
            .pipe(map(result => {
                // Map result to a company object with token
                var company = new Company(result.data.id, result.data.email, result.data.name, result.data.address, result.data.provinceId, result.data.province, result.token);

                // Store new company details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentCompany', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    /**
     * API PUT Request method that updates a company details
     * @param company Company Object
     * @returns Company Updated Object
     */
    update(company: Company) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        const jsonToSend = JSON.stringify(company);
        return this.http.put<any>(`${environment.apiUrl}/Company`, jsonToSend, { headers })
            .pipe(map(result => {
                // Map result to a company object with token
                var company = new Company(result.id, result.email, result.name, result.address, result.provinceId, result.province, this.currentCompanyValue.token);

                // Store new company details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentCompany', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    /**
     * API POST Request method that check if user token is valid
     * @returns token valid or not
     */
    authorized() {
        const companyJson = JSON.stringify(this.currentCompanyValue);
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Company/Authorized`, { companyJson }, { headers })
            .pipe(map(result => {
                return result;
            }));
    }

    /**
     * Method used to log out the user and removes all localstorage information
     */
    logout() {
        // Remove user company from local storage to log user out
        localStorage.removeItem('currentCompany');
        this.currentCompanySubject.next(null!);
    }
}