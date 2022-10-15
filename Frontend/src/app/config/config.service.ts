import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(private http: HttpClient) { }

    getNotes(querry: string) {
        return this.http.get<any>("http://gombino.ddns.net:8081/api/notes?isUrgent=" + querry);
    }
}