import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FP } from '../_models/FP';
import { JobOffer } from '../_models/JobOffer';

@Injectable({ providedIn: 'root' })
export class JobOfferService {
    constructor(private http: HttpClient) { }

    /**
     * API [AUTHORIZED] Get Request method that gets all available fps from DB
     * @returns List of FPs (Object)
     */
    getAll() {
        return this.http.get<JobOffer[]>(`${environment.apiUrl}/JobOffer/All`);
    }

    /**
     * API [AUTHORIZED] Get Request method that gets all available fps from DB with company id condition
     * @returns List of FPs (Object)
     */
    getAllFromCompanyId(id: number) {
        return this.http.get<JobOffer[]>(`${environment.apiUrl}/JobOffer/AllFromId?companyId=` + id);
    }

    /**
     * API POST [Authorized] Request method that creates a new job offer
     * @param jobOffer
     * @returns jobOffer object
     */
    create(jobOffer: JobOffer) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var offerJson = JSON.stringify(jobOffer);
        return this.http.post<any>(`${environment.apiUrl}/JobOffer/Create`, offerJson, { headers })
            .pipe(map(result => {
                // Map result to a joboffer object
                var job = new JobOffer(result.name, result.description, result.remuneration, result.startDate, result.endDate, result.fps, result.schedule, result.id);
                return job;
            }));
    }

    /**
     * API Put [Authorized] Request method that edit an existing job offer
     * @param jobOffer
     * @returns jobOffer object
     */
    update(jobOffer: JobOffer) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var offerJson = JSON.stringify(jobOffer);
        return this.http.put<any>(`${environment.apiUrl}/JobOffer`, offerJson, { headers })
            .pipe(map(result => {
                // Map result to a joboffer object
                var job = new JobOffer(result.name, result.description, result.remuneration, result.startDate, result.endDate, result.fps, result.schedule, result.id);
                return job;
            }));
    }

    /**
     * API Put [Authorized] Request method that delete an offer by his id
     * @param jobOffer
     * @returns offerId offer id (number)
     */
    deleteById(offerId: number) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.delete<any>(`${environment.apiUrl}/JobOffer/?offerId=` + offerId, { headers })
            .pipe(map(result => {
                return result;
            }));
    }


}