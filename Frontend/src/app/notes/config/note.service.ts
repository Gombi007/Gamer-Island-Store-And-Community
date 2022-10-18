import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { STRINGS } from "../../config/strings.enum";
import { noteDto, noteDtoToPost } from "./note.model";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor(private http: HttpClient) { }

    getNotes() {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_GET_NOTES);
    }

    getNotesWithIsUrgentParam(isUrgent: string) {
        return this.http.get<any>(STRINGS.SERVER_URL + STRINGS.API_GET_NOTES_WITH_ISURGENT + isUrgent);
    }

    createNote(note: noteDtoToPost) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(STRINGS.SERVER_URL + STRINGS.API_POST_NOTE, JSON.stringify(note), { headers: headers });
    }

    removeNote(noteId: string) {
        return this.http.delete<any>(STRINGS.SERVER_URL + STRINGS.API_REMOVE_NOTE + noteId);
    }
}