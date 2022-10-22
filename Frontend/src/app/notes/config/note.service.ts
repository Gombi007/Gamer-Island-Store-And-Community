import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { STRINGS } from "../../config/strings.enum";
import { noteDto, noteDtoToPost } from "./note.model";
import { AuthorizationService } from "src/app/config/authorization.service";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }
    noteToModify?: noteDto = undefined;
    cancelModifyOrSubmitAndGoBack = '';

    getNotes() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

    getNotesWithIsUrgentParam(isUrgent: string) {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?isUrgent=' + isUrgent, this.authorServie.headerWithTokenForRequests());
    }

    createNote(note: noteDtoToPost) {
        return this.http.post<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID(), JSON.stringify(note), this.authorServie.headerWithTokenForRequests());
    }
    modifyNote(note: noteDtoToPost, noteId: string) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?noteId=' + noteId, JSON.stringify(note), this.authorServie.headerWithTokenForRequests());
    }

    removeNote(noteId: string) {
        return this.http.delete<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?noteId=' + noteId, this.authorServie.headerWithTokenForRequests());
    }
}