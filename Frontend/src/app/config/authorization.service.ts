import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor() { }

    headerWithTokenForRequests() {
        let auth_token = sessionStorage.getItem('token');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth_token}`
        });
        const requestOptions = { headers: headers };
        return requestOptions;
    }

    getToken() {
        return sessionStorage.getItem('token');
    }

    getUserID() {
        return sessionStorage.getItem('user_id');
    }
}
