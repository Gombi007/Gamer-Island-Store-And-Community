import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AuthorizationService } from "src/app/config/authorization.service";
import { STRINGS } from "src/app/config/strings.enum";
@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }


    getProfileData() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

    updateProfileData(userProfileData: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), userProfileData.value, this.authorServie.headerWithTokenForRequests());
    }

    changePassword(passChangeForm: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), { passChangeForm }, this.authorServie.headerWithTokenForRequests());
    }


}