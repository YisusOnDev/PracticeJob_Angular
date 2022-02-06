import { BehaviorSubject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {
    public isBarLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public isSpinnerLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() {

    }
}

