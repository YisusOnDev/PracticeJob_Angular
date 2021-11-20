import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Province } from '../_models/province';

@Injectable({ providedIn: 'root' })
export class ProvinceService {
    constructor(private http: HttpClient) { }

    /**
     * API [AUTHORIZED] Get Request method that gets all available cities from DB
     * @returns List of Province (Object)
     */
    getAll() {
        return this.http.get<Province[]>(`${environment.apiUrl}/Province/GetAll`);
    }

    /**
     * API [AUTHORIZED] Get Request method to get a City info from his id
     * @param id Number of the city to get info from
     * @returns Province Object
     */
    getFromId(id: number) {
        return this.http.get<Province>(`${environment.apiUrl}/Province/Get?id=` + id);
    }
}