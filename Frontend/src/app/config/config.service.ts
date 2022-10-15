import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { STRINGS } from "./strings.enum";

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    constructor(private http: HttpClient) { }

    getNotes(querry: string) {
        return this.http.get<any>(STRINGS.API_GET_NOTES + querry);
    }
}