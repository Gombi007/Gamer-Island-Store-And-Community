import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { STRINGS } from "./strings.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {

    constructor(private http: HttpClient) { }

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

    hasRoleAdmin() {
        return this.http.get<boolean>(STRINGS.SERVER_URL + STRINGS.API_HAS_ROLE_ADMIN + this.getUserID(), this.headerWithTokenForRequests());
    }
}
