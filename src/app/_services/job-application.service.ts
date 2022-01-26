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
        return this.http.put<any>(`${environment.apiUrl}/JobApplication?applicationId=` + applicationId + "&newStatus=" + newStatus, { headers })
            .pipe(map(result => {
                return result;
            }));
    }
    /**
     * API Post [Authorized] Method to send a contact mail to a student
     * @param destinationMail student mail
     * @param companyName  Current Company Name
     * @param message Mail body
     * @returns bool
     */
    contactStudent(destinationMail: string, companyName: string, message: string) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        const body = { 'destinationMail': destinationMail, 'companyName': companyName, 'message': message };
        return this.http.post<any>(`${environment.apiUrl}/Company/ContactStudent`, body, { headers })
            .pipe(map(result => {
                return result;
            }));
    }


}