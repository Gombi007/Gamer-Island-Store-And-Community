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
    showFullFilterWindow: boolean = false;

    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    getAllDefaultGames(page: number, storeFilter: storeFilter = this.defaultStoreFilter) {
        return this.http.post<{ 'page': storeGame[], 'paginationInfo': PagInfo }>(STRINGS.SERVER_URL + STRINGS.API_GAMES + '?page=' + page + '&size=' + this.defaultSize, storeFilter, this.authorServie.headerWithTokenForRequests());
    }

    getGenresAndLanguagesAndCategories() {
        return this.http.get<{ 'languages': string[], 'genres': string[], 'categories': string[] }>(STRINGS.SERVER_URL + STRINGS.API_GAMES + STRINGS.API_GAMES_LANGUAGES_GENRES_CATEGORIES, this.authorServie.headerWithTokenForRequests());
    }

    adminRemoveGame(gameId: string) {
        return this.http.delete(STRINGS.SERVER_URL + STRINGS.API_ADMIN_REMOVE_GAME + gameId, this.authorServie.headerWithTokenForRequests());
    }
    adminMarkAsAdult(gameId: string) {
        let isAdult = true;
        return this.http.put(STRINGS.SERVER_URL + STRINGS.API_ADMIN_MARK_AS_ADULT_GAME + gameId + '?isAdult=' + isAdult, '', this.authorServie.headerWithTokenForRequests());
    }

}