import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { map } from "rxjs";
import { ProfileService } from "../profile/config/profile.service";
import { AuthenticateService } from "./authenticate.service";
import { AuthorizationService } from "./authorization.service";
import { GlobalService } from "./global.service";
import { STRINGS } from "./strings.enum";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authService: AuthenticateService) { }

    canActivate() {
        if (this.authService.isLoggedIn()) {
            return true;
        }
        this.router.navigate(["login"]);
        return false;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {
    constructor(private profileService: ProfileService) { }

    canActivate() {
        return this.profileService.hasRoleAdmin().pipe(
            map((data: any) => {
                return data;
            }));
    }
}