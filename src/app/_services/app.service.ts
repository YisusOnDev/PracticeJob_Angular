import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class AppService {
    private title = new BehaviorSubject<String>('PracticeJob');
    private title$ = this.title.asObservable();

    constructor() { }

    setTitle(title: String) {
        this.title.next(title);
    }

    getTitle(): Observable<String> {
        return this.title$;
    }
}