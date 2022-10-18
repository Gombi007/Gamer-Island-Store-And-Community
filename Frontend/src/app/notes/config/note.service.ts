import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { STRINGS } from "../../config/strings.enum";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor(private http: HttpClient) { }

    getNotes() {
        return this.http.get<any>(STRINGS.API_GET_NOTES);
    }

    getNotesWithIsUrgentParam(isUrgent: string) {
        return this.http.get<any>(STRINGS.API_GET_NOTES_WITH_ISURGENT + isUrgent);
    }
    createNote() {

    }
}