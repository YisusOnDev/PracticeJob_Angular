import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../_models/company';
import { PremiumService } from './premium.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private tokenSubject: BehaviorSubject<String>;
    public currentToken: Observable<String>;
    private currentCompanySubject: BehaviorSubject<Company>;
    public currentCompany: Observable<Company>;

    constructor(private http: HttpClient, private premiumService: PremiumService) {
        this.tokenSubject = new BehaviorSubject<String>(localStorage.getItem('token')!);
        this.currentToken = this.tokenSubject.asObservable();

        this.currentCompanySubject = new BehaviorSubject<Company>(JSON.parse(localStorage.getItem('company')!));
        this.currentCompany = this.currentCompanySubject.asObservable();
    }
    /**
     * Get current localStorage company data
     */
    public get currentCompanyValue(): Company {
        return this.currentCompanySubject.value;
    }

    /**
     * Get current localStorage token data
     */
    public get currentTokenValue(): String {
        return this.tokenSubject.value;
    }

    /**
     * API POST Request method that send a login request. If login is correct save data to localStorage (including jwt token)
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
                    var company = body;
                    // Store company details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('company', JSON.stringify(company));
                    this.currentCompanySubject.next(company);

                    // Map and store header token
                    var token = response.headers.get('Authorization');
                    localStorage.setItem('token', token);
                    this.tokenSubject.next(token);

                    if (this.currentTokenValue != null && this.currentTokenValue != '') {
                        // Check if company has premium plan
                        this.premiumService.hasPremiumPlan(this.currentCompanyValue)
                            .pipe(first())
                            .subscribe({
                                next: (result) => {
                                    if (result == true) {
                                        this.premiumService.setCurrentPlanValue('premium')
                                    } else {
                                        this.premiumService.setCurrentPlanValue('free')
                                    }
                                },
                                error: () => {
                                    this.premiumService.setCurrentPlanValue('free')
                                }
                            });
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
                var company = body;
                //new Company(body.id, body.email, body.profileImage, body.name, body.address, body.provinceId, body.province, body.validatedEmail);

                // Store new company details in local storage to keep user logged in between page refreshes
                localStorage.setItem('company', JSON.stringify(company));
                this.currentCompanySubject.next(company);

                // Map and store header token
                var token = result.headers.get('Authorization');
                localStorage.setItem('token', token);
                this.tokenSubject.next(token);
                if (this.currentTokenValue != null && this.currentTokenValue != '') {
                    this.premiumService.setCurrentPlanValue('free');
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
                var company = result;
                //new Company(result.id, result.email, result.profileImage, result.name, result.address, result.provinceId, result.province, result.validatedEmail);

                // Store new company details in local storage to keep user logged in between page refreshes
                localStorage.setItem('company', JSON.stringify(company));
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
                var company = result;

                // Store new company details in local storage to keep user logged in between page refreshes
                localStorage.setItem('company', JSON.stringify(company));
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
     * API POST Request method that updates a company details
     * @param company Company Object
     * @returns Company Updated Object
     */
    uploadProfileImage(image: FormData) {
        return this.http.post<any>(`${environment.apiUrl}/Company/UploadImage?companyId=${this.currentCompanyValue.id}`, image, { reportProgress: true, observe: 'response' })
            .pipe(map(apiResult => {
                const result = apiResult.body;
                // Map result to a company object with token
                var company = result;

                // Store new company details in local storage to keep user logged in between page refreshes
                localStorage.setItem('company', JSON.stringify(company));
                this.currentCompanySubject.next(company);
                return company;
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
        return 'index';
    }

    /**
     * API POST Method that generates an stripeId for the customer and return a company object for updating current one with updated values
     * @param company Company object
     * @returns true if created and saved false if something fails
     */
    createStripeAccount(company: Company) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var jsonToSend = JSON.stringify(company);
        return this.http.post<any>(`${environment.apiUrl}/Stripe/CreateAccount`, jsonToSend, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    const body = response.body;
                    // Map result to a company object
                    var company = body;
                    if (company) {
                        // Store company details with his new stripeId
                        localStorage.setItem('company', JSON.stringify(company));
                        this.currentCompanySubject.next(company);
                        return true
                    }
                    return false
                })
            );
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
     * Method used to log out the user and removes all localStorage information
     */
    logout() {
        // Remove local storage data to log user out
        this.premiumService.resetPlan();
        localStorage.removeItem('company');
        this.currentCompanySubject.next(null!);
        localStorage.removeItem('token');
        this.tokenSubject.next(null!);
    }
}