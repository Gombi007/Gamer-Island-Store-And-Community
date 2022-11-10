import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ShowNotesComponent implements OnInit, OnDestroy {
  currentlyRouteAfterNotesTag = '';
  notes: noteDto[];
  isPending: boolean = false;
  currentUserId: string | null = "";
  pagInfo: PagInfo;


  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private webSocketService: WebsocketService) { }

  ngOnInit(): void {
    this.currentUserId = localStorage.getItem('user_id');
    this.route.params.subscribe(
      (param: Params) => {
        this.pagInfo = new PagInfo(0, 0, 0);
        this.notes = [];
        this.noteService.cancelModifyOrSubmitAndGoBack = this.router.url;
        this.currentlyRouteAfterNotesTag = param['favOrMyNotes'];
        this.showNotes(this.currentlyRouteAfterNotesTag, this.pagInfo.actualPage);
      }
    );

    this.webSocketService.subscribe('/topic/notes', (message: any): void => {
      let messageJsonFromBackend = JSON.parse(message.body)
      this.findByIdFromNotesAndModify(messageJsonFromBackend["operation"], messageJsonFromBackend["noteId"])
    });
  }

  showNotes(favOrMyNotes: string = '', page: number) {
    this.isPending = true;
    if (favOrMyNotes === '' || favOrMyNotes === 'community') {
      this.noteService.getPublicNotes(page).subscribe({
        next: (data) => {
          if (this.notes.length > 0) {
            this.notes = this.notes.concat(data.page);
          }
          if (this.notes.length === 0) {
            this.notes = data.page;
          }
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
      this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes, page).subscribe({
        next: (data) => {
          if (this.notes.length > 0) {
            this.notes = this.notes.concat(data.page);
          }
          if (this.notes.length === 0) {
            this.notes = data.page;
          }
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
      this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes, page).subscribe({
        next: (data) => {
          if (this.notes.length > 0) {
            this.notes = this.notes.concat(data.page);
          }
          if (this.notes.length === 0) {
            this.notes = data.page;
          }
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

  editNote(note: noteDto) {
    if (!this.isPending) {
      this.noteService.noteToModify = note;
      this.router.navigate(['/notes/add/create-note'])
    }
  }


  findByIdFromNotesAndModify(operation: string, noteId: string) {
    this.isPending = true;
    let noteDto = this.notes.find(note => note.id === noteId)
    if (noteDto !== undefined) {
      operation === 'favoriteChange' ? noteDto.isFavorite = !noteDto.isFavorite : '';
      operation === 'visibilityChange' ? noteDto.visibilityOnlyForMe = !noteDto.visibilityOnlyForMe : '';
    }

    let noteDtoIndex = this.notes.findIndex(note => note.id === noteId)
    if (noteDtoIndex !== -1) {
      operation === 'favoriteChange' && this.currentlyRouteAfterNotesTag === 'favorites' ? this.notes.splice(noteDtoIndex, 1) : '';
      operation === 'visibilityChange' && this.currentlyRouteAfterNotesTag === 'community' ? this.notes.splice(noteDtoIndex, 1) : '';
      operation === 'visibilityChange' && this.currentUserId !== noteDto?.creatorId ? this.notes.splice(noteDtoIndex, 1) : '';

      operation === 'remove' ? this.notes.splice(noteDtoIndex, 1) : '';
    }
    this.isPending = false;
  }

  removeNote(noteDto: noteDto) {
    if (!this.isPending) {
      this.isPending = true;
      this.noteService.removeNote(noteDto.id).subscribe({
        next: () => {
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

  addOrRemoveToFavoriteList(noteDto: noteDto) {
    if (!this.isPending) {
      this.isPending = true;
      this.noteService.addOrRemoveNoteToUserFavList(noteDto.id, !noteDto.isFavorite)
        .subscribe({
          next: () => {
            this.findByIdFromNotesAndModify('favoriteChange', noteDto.id);
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
    if (this.pagInfo.totalPages - this.pagInfo.actualPage >= 2) {
      this.showNotes(this.currentlyRouteAfterNotesTag, ++this.pagInfo.actualPage);
    }
  }

  onScrollUp(event: any) {
    /*
    if (this.pagInfo.actualPage > 0) {
      this.pagInfo.actualPage--;
      this.notes.splice(this.notes.length - 3, 3);
    }
    */
  }

  ngOnDestroy(): void {

  }

}
