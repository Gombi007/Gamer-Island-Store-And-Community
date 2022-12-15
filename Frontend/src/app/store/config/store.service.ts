import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { AuthorizationService } from "src/app/config/authorization.service";
import { PagInfo } from "src/app/config/pag-info.model";
import { STRINGS } from "src/app/config/strings.enum";
import { storeFilter } from "./store-filter.model";
import { storeGame } from "./store-game.model";

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    storeFilter: Subject<storeFilter> = new Subject<storeFilter>();
    defaultStoreFilter = new storeFilter();
    defaultSize: number = 18;
    allFilterResult = 0;

    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    getAllDefaultGames(page: number, storeFilter: storeFilter = this.defaultStoreFilter) {
        return this.http.post<{ 'page': storeGame[], 'paginationInfo': PagInfo }>(STRINGS.SERVER_URL + STRINGS.API_GAMES + '?page=' + page + '&size=' + this.defaultSize, storeFilter, this.authorServie.headerWithTokenForRequests());
    }
}