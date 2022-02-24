import { PrivateMessage } from './../_models/privatemessage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Company } from '../_models/company';

@Injectable({ providedIn: 'root' })
export class PremiumService {
    private planSubject: BehaviorSubject<String>;
    public currentPlan: Observable<String>;

    constructor(private http: HttpClient) {
        this.planSubject = new BehaviorSubject<String>(localStorage.getItem('plan')!);
        this.currentPlan = this.planSubject.asObservable();
    }

    /**
     * Get current localStorage token data
     */
    public get getCurrentPlanValue(): String {
        return this.planSubject.value;
    }

    public setCurrentPlanValue(plan: String) {
        localStorage.setItem('plan', plan.toString());
        this.planSubject.next(plan);
    }

    public resetPlan() {
        localStorage.removeItem('plan');
        this.planSubject.next(null!);
    }

    /**
     * API POST Request method that send a login request. If login is correct save data to localStorage (including jwt token)
     * @param email
     * @param password 
     * @returns Company Object
     */
    hasPremiumPlan(company: Company) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var jsonToSend = JSON.stringify(company);
        return this.http.post<any>(`${environment.apiUrl}/Stripe/IsPremium`, jsonToSend, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    const body = response.body;
                    if (body == null) {
                        return false;
                    }
                    return body;
                })
            );
    }

    generatePayLink(company: Company) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var jsonToSend = JSON.stringify(company);
        return this.http.post<any>(`${environment.apiUrl}/Stripe/GenerateSubscriptionLink`, jsonToSend, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    var body = response.body;
                    if (body != null) {
                        return body.url;
                    }
                    return null;
                })
            );
    }

    searchStudents(company: Company, filter: string, fpId?: number, provinceId?: number) {
        var endpoint = 'Student/';
        switch (filter) {
            case 'all':
                endpoint += `GetAllPremiumFPAndProvince?fpId=${fpId}&provinceId=${provinceId}`;
                break;
            case 'fp':
                endpoint += `GetAllPremiumFP?fpId=${fpId}`;
                break;
            case 'province':
                endpoint += `GetAllPremiumProvince?provinceId=${provinceId}`
                break;
        }
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var jsonToSend = JSON.stringify(company);
        return this.http.post<any>(`${environment.apiUrl}/${endpoint}`, jsonToSend, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    if (response.body == '') {
                        return 'empty';
                    }
                    return response.body;
                })
            );
    }

    messageStudent(privateMessage: PrivateMessage) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var jsonToSend = JSON.stringify(privateMessage);
        return this.http.post<any>(`${environment.apiUrl}/PrivateMessage/SendMessage`, jsonToSend, { headers, observe: 'response' })
            .pipe(
                map((response: any) => {
                    return response.body;
                })
            );
    }
}