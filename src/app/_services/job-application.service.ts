import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
    constructor(private http: HttpClient) { }

    /**
     * API Put [Authorized] Request method that edit an existing job application status
     * @param applicationId jobApplication Id
     * @param newStatus ApplicationStatus Id
     * @returns bool
     */
    updateStatus(applicationId: number, newStatus: number) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        return this.http.put<any>(`${environment.apiUrl}/JobApplication?applicationId=`+applicationId+"&newStatus="+newStatus, { headers })
            .pipe(map(result => {
                return result;
            }));
    }


}