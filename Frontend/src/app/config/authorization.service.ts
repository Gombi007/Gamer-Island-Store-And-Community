import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor() { }

    headerWithTokenForRequests() {
        let auth_token = localStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        });
        const requestOptions = { headers: headers };
        return requestOptions;
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getUserID() {
        return localStorage.getItem('user_id');
    }
}
