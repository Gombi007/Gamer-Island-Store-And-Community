import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthorizationService } from "src/app/config/authorization.service";
import { STRINGS } from "src/app/config/strings.enum";

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    saveNewGamesFromSteamToDb() {
        let page = 0;
        let size = 80;
        return this.http.get(STRINGS.SERVER_URL + STRINGS.API_ADMIN_SAVE_GAMES + "?page=" + page + "&size=" + size, this.authorServie.headerWithTokenForRequests());
    }

}
