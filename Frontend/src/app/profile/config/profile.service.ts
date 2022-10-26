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

    private userProfileData = {
        username: '',
        avatar: ''
    }

    get userProfileDataGetter(): { username: string, avatar: string } {
        return this.userProfileData
    }

    set userProfileDataSetter(userProfileData: { username: string, avatar: string }) {
        this.userProfileData = userProfileData;
    }

    getProfileData() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

    updateProfileData(userProfileData: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE + this.authorServie.getUserID(), userProfileData.value, this.authorServie.headerWithTokenForRequests());
    }

    changePassword(changePasswordForm: FormGroup) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_PROFILE_CHANGE_PASSWORD + this.authorServie.getUserID(), changePasswordForm.value, this.authorServie.headerWithTokenForRequests());
    }

}
