import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/config/authorization.service';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';
import { RxStompService } from '../../config/websocket/rx-stomp.service';

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
  noteSub: Subscription;
  noteSubscriptions: Subscription[] = [];
  private topicSubscription: Subscription;

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private authService: AuthorizationService, private rxStompService: RxStompService) { }

  @ViewChild(InfiniteScrollDirective) infiniteScrollDirective: any;
  resetInfiniteScrollerWhenRouteChanges() {
    if (this.infiniteScrollDirective) {
      this.infiniteScrollDirective.disposeScroller.unsubscribe();
      this.infiniteScrollDirective.setup();
    }
  }

  ngOnInit(): void {
    this.currentUserId = this.authService.getUserID();
    this.route.params.subscribe(
      (param: Params) => {
        this.resetInfiniteScrollerWhenRouteChanges();
        this.pagInfo = new PagInfo(0, 0, 0);
        this.notes = [];
        this.noteService.cancelModifyOrSubmitAndGoBack = this.router.url;
        this.currentlyRouteAfterNotesTag = param['favOrMyNotes'];
        this.showNotes(this.currentlyRouteAfterNotesTag, this.pagInfo.actualPage);
      }
    );

    //websocket watcher
    this.topicSubscription = this.rxStompService.watch('/topic/notes').subscribe((message: any) => {
      let messageJsonFromBackend = JSON.parse(message.body)
      console.log(messageJsonFromBackend);
    });



    /*
        this.webSocketService.subscribe('/topic/notes', (message: any): void => {
          let messageJsonFromBackend = JSON.parse(message.body)
          this.findByIdFromNotesAndModify(messageJsonFromBackend["operation"], messageJsonFromBackend["noteId"])
    
          console.log(messageJsonFromBackend);
    
          //let modifiedNote = this.notes.find(note => note.id === messageJsonFromBackend["noteId"]);
          if (true) {
            console.log(true);
    
          }
        });
        */
  }
  showNotes(favOrMyNotes: string = '', page: number) {
    this.isPending = true;
    this.cancelAllLiveSubs(this.noteSubscriptions);

    if (favOrMyNotes === '' || favOrMyNotes === 'community') {
      this.noteSub = this.noteService.getPublicNotes(page).subscribe({
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
      this.noteSubscriptions.push(this.noteSub);
    }

    if (favOrMyNotes === 'favorites') {
      this.noteSub = this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes, page).subscribe({
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
      this.noteSubscriptions.push(this.noteSub);
    }

    if (favOrMyNotes === 'my-notes') {
      this.noteSub = this.noteService.getFavoriteNotesOrMyNotes(favOrMyNotes, page).subscribe({
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
      this.noteSubscriptions.push(this.noteSub);
    }
  }

  cancelAllLiveSubs(noteSubs: Subscription[]) {
    if (noteSubs.length > 0) {
      noteSubs.forEach((sub, index) => {
        sub.unsubscribe();
        noteSubs.splice(index, 1);
      });
    }
  }

  findByIdFromNotesAndModify(operation: string, noteId: string) {
    this.isPending = true;
    let noteDto = this.notes.find(note => note.id === noteId)
    if (noteDto !== undefined) {
      operation === 'favoriteChange' ? noteDto.isFavorite = !noteDto.isFavorite : '';
      operation === 'visibilityChange' ? noteDto.visibilityOnlyForMe = !noteDto.visibilityOnlyForMe : '';

      let noteDtoIndex = this.notes.findIndex(note => note.id === noteId)
      if (noteDtoIndex !== -1) {
        operation === 'favoriteChange' && this.currentlyRouteAfterNotesTag === 'favorites' ? this.notes.splice(noteDtoIndex, 1) : '';
        operation === 'visibilityChange' && this.currentlyRouteAfterNotesTag === 'community' ? this.notes.splice(noteDtoIndex, 1) : '';
        operation === 'visibilityChange' && this.currentlyRouteAfterNotesTag === 'favorites' && this.currentUserId !== noteDto?.creatorId ? this.notes.splice(noteDtoIndex, 1) : '';

        operation === 'remove' ? this.notes.splice(noteDtoIndex, 1) : '';
      }
    }
    this.isPending = false;
  }

  updateNoteListAfterAnyChanges(noteDto: noteDto) {
    this.noteService.getNoteById(noteDto.id).subscribe({
      next: (dto: any) => {
        if (this.notes.includes(noteDto)) {
          console.log(dto);
        }
      }

    });
  }

  editNote(note: noteDto) {
    if (!this.isPending) {
      this.noteService.noteToModify = note;
      this.router.navigate(['/notes/add/create-note'])
    }
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
    if (this.pagInfo.totalPages - this.pagInfo.actualPage > 1) {
      this.showNotes(this.currentlyRouteAfterNotesTag, ++this.pagInfo.actualPage);
    }
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
  }

}
