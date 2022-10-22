import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class GlobalService {
    constructor(private router: Router) { }


    isExpiredToken(errorResponse: any) {
        if (errorResponse.error.error_message !== undefined) {
            if (errorResponse.error.error_message.includes("The Token has expired")) {
                this.router.navigate(['login', { expiredTokenMessage: "The session was expired, please login again." }]);
            }
        }
    }
}