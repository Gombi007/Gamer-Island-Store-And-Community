import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthenticateService {

    isLoggedIn() {
        // return localStorage.getItem('token') != null;
        return false;
    }
}