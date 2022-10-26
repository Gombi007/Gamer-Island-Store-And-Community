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
  currentlyRouteAfterNotesTag = '';
  notes: noteDto[] = [];
  isPending: boolean = false;
  currentUserId: string | null = "";

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('user_id');
    this.route.params.subscribe(
      (param: Params) => {
        this.noteService.cancelModifyOrSubmitAndGoBack = this.router.url;
        this.currentlyRouteAfterNotesTag = param['favOrMyNotes'];
        this.showNotes(this.currentlyRouteAfterNotesTag);
      }
    );
  }

  showNotes(favOrMyNotes: string = '') {
    this.isPending = true;
    if (favOrMyNotes === '' || favOrMyNotes === 'community') {
      this.noteService.getPublicNotes().subscribe({
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

    if (favOrMyNotes === 'favorites') {
      this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes).subscribe({
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
    if (favOrMyNotes === 'my-notes') {
      this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes).subscribe({
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
          this.showNotes(this.currentlyRouteAfterNotesTag);
          this.isPending = false;
        },
        error: (response) => {
          console.log(response);
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

  addOrRemoveToFavoriteList(noteDto: noteDto) {
    if (!this.isPending) {
      this.isPending = true;
      this.noteService.addOrRemoveNoteToUserFavList(noteDto.id, !noteDto.isFavorite)
        .subscribe({
          next: () => {
            this.showNotes(this.currentlyRouteAfterNotesTag);
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
