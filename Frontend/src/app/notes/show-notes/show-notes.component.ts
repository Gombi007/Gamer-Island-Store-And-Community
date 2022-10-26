import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { tap } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
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

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService) { }

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
    this.isPending = true;
    if (isUrgent === '' || isUrgent === 'all') {
      this.noteService.getNotes().subscribe({
        next: (data) => {
          this.notes = data;
          this.isPending = false;

        },
        error: (response) => {
          this.globalService.isExpiredToken(response);
          this.isPending = false;
        }
      });
    }

    if (isUrgent === 'urgent') {
      this.noteService.getNotesWithIsUrgentParam('true').subscribe({
        next: (data) => {
          this.notes = data;
          this.isPending = false;
        },
        error: (response) => {
          this.globalService.isExpiredToken(response);
          this.isPending = false;
        }
      });
    }
    if (isUrgent === 'non-urgent') {
      this.noteService.getNotesWithIsUrgentParam('false').subscribe({
        next: (data) => {
          this.notes = data;
          this.isPending = false;
        },
        error: (response) => {
          this.globalService.isExpiredToken(response);
          this.isPending = false;
        }
      });
    }
  }

  removeNote(noteId: string) {
    if (!this.isPending) {
      this.isPending = true;
      this.noteService.removeNote(noteId).subscribe({
        next: () => {
          this.showNotes(this.currentlyRouteAfterUrgentTag);
          this.isPending = false;
        },
        error: (response) => {
          this.globalService.isExpiredToken(response);
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
      this.isPending = true;
      let noteForm: FormGroup = new FormGroup({
        'title': new FormControl(note.title),
        'text': new FormControl(note.text),
        'imgUrl': new FormControl(note.imgUrl),
        'isUrgent': new FormControl(!note.isUrgent),
      });
      this.noteService.modifyNote(noteForm, noteId)
        .subscribe({
          next: () => {
            this.showNotes(this.currentlyRouteAfterUrgentTag);
            this.isPending = false;
          },
          error: (response) => {
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });
    }
  }

}
