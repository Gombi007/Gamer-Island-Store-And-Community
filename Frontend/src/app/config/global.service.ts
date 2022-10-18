import { Injectable } from "@angular/core";
import { noteDto } from "../notes/config/note.model";

@Injectable({
    providedIn: 'root'
})
export class NoteService {
    constructor() { }
    noteToModify = null;

}