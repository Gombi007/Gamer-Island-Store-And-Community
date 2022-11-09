import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { STRINGS } from "../../config/strings.enum";
import { noteDto } from "./note.model";
import { AuthorizationService } from "src/app/config/authorization.service";
import { FormGroup } from "@angular/forms";
import { paginationDto } from "src/app/config/pagination.model";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    noteToModify?: noteDto = undefined;
    cancelModifyOrSubmitAndGoBack = '';
    paginationDto: paginationDto = new paginationDto(0, 3, "created");

    constructor(private http: HttpClient, private authorServie: AuthorizationService) { }

    getPublicNotes() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() +
            '?page=' + this.paginationDto.$page +
            '&size=' + this.paginationDto.$size +
            '&sortBy=' + this.paginationDto.$sortBy,
            this.authorServie.headerWithTokenForRequests());
    }

    getFavoriteNotesOrMyNotes(favOrMyNotes: string) {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES + this.authorServie.getUserID() +
            '?favOrMyNotes=' + favOrMyNotes +
            '&page=' + this.paginationDto.$page +
            '&size=' + this.paginationDto.$size +
            '&sortBy=' + this.paginationDto.$sortBy,
            this.authorServie.headerWithTokenForRequests());
    }

    addOrRemoveNoteToUserFavList(noteId: string, isFavorite: boolean) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_ADD_OR_REMOVE_NOTE_TO_USER_FAV_LIST + noteId + "/" + this.authorServie.getUserID() + '?isNoteFavorite=' + isFavorite, {}, this.authorServie.headerWithTokenForRequests());
    }

    changeVisibility(noteId: string, visibility: boolean) {
        return this.http.put<any>(STRINGS.SERVER_URL + STRINGS.API_NOTES_CHANGE_VISIBILITY + noteId + "/" + this.authorServie.getUserID() + '?visibility=' + visibility, {}, this.authorServie.headerWithTokenForRequests());
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