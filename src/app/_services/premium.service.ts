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

    /**
     * POST Method that generates an stripe payment link for a subscription
     * @param company Company object
     * @returns the stripe payment url
     */
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

    /**
     * POST Method that handle a list of students filtered
     * @param company Company object
     * @param filter Filter to use (string)
     * @param fpId id of fp to search if any
     * @param provinceId  id of province to search if any
     * @returns filtered list of all filtered students
     */
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

    /**
     * POST Method that sends a message to a student (private message)
     * @param privateMessage the company message that need to be sent to the student
     * @returns true if done false if fails
     */
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