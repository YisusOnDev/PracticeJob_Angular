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
     * API POST [Authorized] Request method that creates a new job offer
     * @param jobOffer
     * @returns jobOffer object
     */
    create(jobOffer: JobOffer) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        var offerJson = JSON.stringify(jobOffer);
        console.log(offerJson);
        return this.http.post<any>(`${environment.apiUrl}/JobOffer/Create`, offerJson, { headers })
            .pipe(map(result => {
                console.log(result);
                // Map result to a joboffer object
                var job = new JobOffer(result.name, result.description, result.remuneration, result.startDate, result.endDate, result.fps, result.schedule, result.id);
                return job;
            }));
    }
}