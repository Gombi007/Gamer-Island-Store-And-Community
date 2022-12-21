import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { map, Observable, Subject } from "rxjs";
import { AuthorizationService } from "src/app/config/authorization.service";
import { STRINGS } from "src/app/config/strings.enum";
@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    updateProfile = new Subject();
    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    getProfileData() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

    updateProfileData(userProfileData: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), userProfileData.value, this.authorServie.headerWithTokenForRequests());
    }

    changePassword(changePasswordForm: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE_CHANGE_PASSWORD + this.authorServie.getUserID(), changePasswordForm.value, this.authorServie.headerWithTokenForRequests());
    }

    hasRoleAdmin() {
        return this.http.get<boolean>(STRINGS.SERVER_URL + STRINGS.API_HAS_ROLE_ADMIN + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

}
