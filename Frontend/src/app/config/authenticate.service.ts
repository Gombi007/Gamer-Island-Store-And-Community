import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";
import { STRINGS } from "./strings.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {

    constructor(private http: HttpClient) { }

    isLoggedIn() {
        return localStorage.getItem('token') != null;
    }

    loginViaBackend(userCredential: any) {
        let body = new FormData();
        body.set('username', userCredential.username);
        body.set('password', userCredential.password);
        return this.http.post<any>(STRINGS.SERVER_URL + STRINGS.API_LOGIN, body);
    }
}