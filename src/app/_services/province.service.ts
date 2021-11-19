import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Province } from '../_models/province';

@Injectable({ providedIn: 'root' })
export class ProvinceService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Province[]>(`${environment.apiUrl}/Province/GetAll`);
    }
}