import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
import { WebsocketService } from 'src/app/config/websocket.service';
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
  pagInfo: PagInfo;


  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('user_id');
    this.route.params.subscribe(
      (param: Params) => {
        this.noteService.cancelModifyOrSubmitAndGoBack = this.router.url;
        this.currentlyRouteAfterNotesTag = param['favOrMyNotes'];
        this.showNotes(this.currentlyRouteAfterNotesTag);
      }
    );

    this.webSocketService.subscribe('/topic/notes', (): void => {
      this.showNotes(this.currentlyRouteAfterNotesTag);
    });
  }

  showNotes(favOrMyNotes: string = '') {
    this.isPending = true;
    if (favOrMyNotes === '' || favOrMyNotes === 'community') {
      this.noteService.getPublicNotes().subscribe({
        next: (data) => {
          this.notes = data.page;
          this.pagInfo = data.paginationInfo;
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
          this.notes = data.page;
          this.pagInfo = data.paginationInfo;
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
          this.notes = data.page;
          this.pagInfo = data.paginationInfo;
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

  changeVisibility(noteDto: noteDto) {
    if (!this.isPending) {
      this.isPending = true;
      this.noteService.changeVisibility(noteDto.id, !noteDto.visibilityOnlyForMe)
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

  onScrollDown(event: any) {
    console.log(event);
  }
  onScrollUp(event: any) {
    console.log(event);
  }
}
