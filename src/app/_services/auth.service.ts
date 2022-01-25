import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../_models/company';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<String>;
    public currentToken: Observable<String>;
    private currentCompanySubject: BehaviorSubject<Company>;
    public currentCompany: Observable<Company>;

    constructor(private http: HttpClient) {
        this.tokenSubject = new BehaviorSubject<String>(sessionStorage.getItem('token')!);
        this.currentToken = this.tokenSubject.asObservable();

        this.currentCompanySubject = new BehaviorSubject<Company>(JSON.parse(sessionStorage.getItem('company')!));
        this.currentCompany = this.currentCompanySubject.asObservable();
    }
    /**
     * Get current sessionStorage company data
     */
    public get currentCompanyValue(): Company {
        return this.currentCompanySubject.value;
    }

    /**
     * Get current sessionStorage token data
     */
    public get currentTokenValue(): String {
        return this.tokenSubject.value;
    }

    /**
     * API POST Request method that send a login request. If login is correct save data to sessionStorage (including jwt token)
     * @param email
     * @param password 
     * @returns Company Object
     */
    login(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Auth/Login`, { email, password, 'loginType': 'Company' }, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    const body = response.body;

                    // Map result to a company object
                    var company = new Company(body.id, body.email, body.name, body.address, body.provinceId, body.province, body.validatedEmail);

                    // Store company details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('company', JSON.stringify(company));
                    this.currentCompanySubject.next(company);

                    // Map and store header token
                    var token = response.headers.get('Authorization');
                    sessionStorage.setItem('token', token);
                    this.tokenSubject.next(token);

                    if (this.currentTokenValue != null && this.currentTokenValue != '') {
                        return company;
                    }
                    return null;

                })
            );
    }

    /**
     * API POST Request method that creates (if valid) a new company including jwt token
     * @param email 
     * @param password 
     * @returns Company Object
     */
    create(email: string, password: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post<any>(`${environment.apiUrl}/Auth/Create`, { email, password, 'loginType': 'Company' }, { headers, observe: 'response' })
            .pipe(map((result: any) => {
                const body = result.body;
                // Map result to a company object
                var company = new Company(body.id, body.email, body.name, body.address, body.provinceId, body.province, body.validatedEmail);

                // Store new company details in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('company', JSON.stringify(company));
                this.currentCompanySubject.next(company);

                // Map and store header token
                var token = result.headers.get('Authorization');
                sessionStorage.setItem('token', token);
                this.tokenSubject.next(token);
                if (this.currentTokenValue != null && this.currentTokenValue != '') {
                    return company;
                }

                return null;

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
                var company = new Company(result.id, result.email, result.name, result.address, result.provinceId, result.province, result.validatedEmail);

                // Store new company details in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('company', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    /**
     * API POST Request method that sends confirmation email to company email
     * @param company Company Object
     * @returns Company Updated Object
     */
    sendEmailConfirm() {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${environment.apiUrl}/Company/SendEmailConfirm`, this.currentCompanyValue, { headers })
            .pipe(map(result => {
                return result;
            }));
    }

    /**
     * API POST Request method that updates a company details
     * @param company Company Object
     * @returns Company Updated Object
     */
    valideEmail(code: String) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${environment.apiUrl}/Company/ValidateEmail?code=${code}`, this.currentCompanyValue, { headers })
            .pipe(map(result => {
                // Map result to a company object with token
                var company = new Company(result.id, result.email, result.name, result.address, result.provinceId, result.province, result.validatedEmail);

                // Store new company details in local storage to keep user logged in between page refreshes
                sessionStorage.setItem('company', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
            }));
    }

    /**
     * API POST Request method that updates a company details
     * @param company Company Object
     * @returns Company Updated Object
     */
    sendResetPasswordCode(email: String) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.post<any>(`${environment.apiUrl}/Company/SendPasswordReset?email=${email}`, { headers })
            .pipe(map(result => {
                return result;
            }));
    }

    /**
     * API POST Request method that updates a company details
     * @param company Company Object
     * @returns Company Updated Object
     */
    updatePassword(email: String, password: String, code: String) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        const body = { 'email': email, 'password': password, 'tfaCode': code }
        return this.http.post<any>(`${environment.apiUrl}/Company/UpdatePassword`, body, { headers })
            .pipe(map(result => {
                return result;
            }));
    }



    /**
     * Method to know where user should go (Confirm Acc, Complete profile and so...)
     * @returns route to redirection user
     */
    getFirstRoute() {
        if (this.currentCompanyValue != null) {
            if (!this.currentCompanyValue.validatedEmail) {
                return 'confirmaccount';
            } else if (this.currentCompanyValue.name == null) {
                return 'completeprofile';
            }
            return 'home';
        }
        return '/';

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
     * Method used to log out the user and removes all sessionStorage information
     */
    logout() {
        // Remove local storage data to log user out
        sessionStorage.removeItem('company');
        this.currentCompanySubject.next(null!);
        sessionStorage.removeItem('token');
        this.tokenSubject.next(null!);
    }
}