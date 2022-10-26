import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { STRINGS } from "../../config/strings.enum";
import { noteDto } from "./note.model";
import { AuthorizationService } from "src/app/config/authorization.service";
import { FormGroup } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    noteToModify?: noteDto = undefined;
    cancelModifyOrSubmitAndGoBack = '';

    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    getPublicNotes() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID(), this.authorServie.headerWithTokenForRequests());
    }

    getNotesWithIsUrgentParam(isUrgent: string) {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?isUrgent=' + isUrgent, this.authorServie.headerWithTokenForRequests());
    }

    createNote(noteForm: FormGroup) {
        return this.http.post<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID(), noteForm.value, this.authorServie.headerWithTokenForRequests());
    }
    modifyNote(noteForm: FormGroup, noteId: string) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?noteId=' + noteId, noteForm.value, this.authorServie.headerWithTokenForRequests());
    }

    removeNote(noteId: string) {
        return this.http.delete<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() + '?noteId=' + noteId, this.authorServie.headerWithTokenForRequests());
    }
}