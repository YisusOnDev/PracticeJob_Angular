import { FP } from './../_models/fp';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class FPService {
    constructor(private http: HttpClient) { }

    /**
     * API [AUTHORIZED] Get Request method that gets all available fps from DB
     * @returns List of FPs (Object)
     */
    getAll() {
        return this.http.get<FP[]>(`${environment.apiUrl}/FP/All`);
    }
}