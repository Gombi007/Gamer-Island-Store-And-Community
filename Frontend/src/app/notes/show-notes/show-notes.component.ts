import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-show-notes',
  templateUrl: './show-notes.component.html',
  styleUrls: ['./show-notes.component.scss']
})
export class ShowNotesComponent implements OnInit {
  currentlyRouteAfterUrgentTag = '';
  notes: noteDto[] = [];
  isPending: boolean = false;

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        this.noteService.cancelModifyOrSubmitAndGoBack = this.router.url;
        this.currentlyRouteAfterUrgentTag = param['urgent'];
        this.showNotes(this.currentlyRouteAfterUrgentTag);
      }
    );
  }

  showNotes(isUrgent: string = '') {
    if (isUrgent === '' || isUrgent === 'all') {
      this.noteService.getNotes()
        .pipe(tap(() => { this.isPending = true }))
        .subscribe({
          next: (data) => {
            this.notes = data
            this.isPending = false
          }
        });
    }

    if (isUrgent === 'urgent') {
      this.noteService.getNotesWithIsUrgentParam('true')
        .pipe(tap(() => { this.isPending = true }))
        .subscribe({
          next: (data) => {
            this.notes = data
            this.isPending = false
          }
        });
    }
    if (isUrgent === 'non-urgent') {
      this.noteService.getNotesWithIsUrgentParam('false')
        .pipe(tap(() => { this.isPending = true }))
        .subscribe({
          next: (data) => {
            this.notes = data
            this.isPending = false
          }
        });
    }
  }

  removeNote(noteId: string) {
    if (!this.isPending) {
      this.noteService.removeNote(noteId)
        .pipe(tap(() => { this.isPending = true }))
        .subscribe({
          next: () => {
            this.showNotes(this.currentlyRouteAfterUrgentTag);
            this.isPending = false;
          }
        });
    }
  }

  editNote(note: noteDto) {
    if (!this.isPending) {
      this.noteService.noteToModify = note;
      this.router.navigate(['/notes/add/create-note'])
    }
  }

  changeUrgentOrNotNoteStatus(note: noteDto, noteId: string) {
    if (!this.isPending) {
      note.isUrgent = !note.isUrgent;
      this.noteService.modifyNote(note, noteId)
        .pipe(tap(() => { this.isPending = true }))
        .subscribe({
          next: () => {
            this.showNotes(this.currentlyRouteAfterUrgentTag);
            this.isPending = false;
          }
        });
    }
  }

}
