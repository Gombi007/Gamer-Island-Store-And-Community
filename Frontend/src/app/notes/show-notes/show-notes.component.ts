import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { delay, from, Observable, Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/config/authorization.service';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';
import { RxStompService } from '../../config/websocket/rx-stomp.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WarnDialogComponent } from 'src/app/user-indicators/warn-dialog/warn-dialog.component';

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
  player: HTMLVideoElement;

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router, private globalService: GlobalService, private authService: AuthorizationService, private rxStompService: RxStompService, private dialogRef: MatDialog) { }

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
      this.findNoteByIdAndDoTheOperationsWithIt(messageJsonFromBackend["operation"], messageJsonFromBackend["noteId"])
    });
  }

  showNotes(favOrMyNotes: string = '', page: number) {
    this.isPending = true;
    this.cancelAllLiveSubs(this.noteSubscriptions);

    if (favOrMyNotes === '' || favOrMyNotes === 'community') {
      this.noteSub = this.noteService.getPublicNotes(page).subscribe({
        next: (data) => {
          this.notes.length > 0 ? this.notes = this.notes.concat(data.page) : this.notes = data.page;
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
          this.notes.length > 0 ? this.notes = this.notes.concat(data.page) : this.notes = data.page;
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
          this.notes.length > 0 ? this.notes = this.notes.concat(data.page) : this.notes = data.page;
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

  findNoteByIdAndDoTheOperationsWithIt(operation: string, noteId: string) {
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
      //update current note in the list if it contains and not favorite change
      operation !== 'favoriteChange' ? this.updateNoteListAfterAnyChanges(noteId) : '';
    }
    this.isPending = false;
  }

  updateNoteListAfterAnyChanges(noteId: string) {
    let noteDto = this.notes.find(note => note.id === noteId)
    if (noteDto !== undefined) {
      this.noteService.getNoteById(noteDto.id).subscribe({
        next: (dto: noteDto) => {
          if (dto !== null && noteDto) {
            let savedUserFavState = noteDto.isFavorite;
            noteDto = Object.assign(noteDto, dto);
            noteDto.isFavorite = savedUserFavState;
          }
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

  removeNote(noteDto: noteDto) {
    if (!this.isPending) {
      let warningText1 = 'Remove';
      let warningText2 = 'Are you sure to remove this note?<br>This note will not be recoverable!'

      this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
        if (userConfirm) {
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
      });
    }
  }

  addOrRemoveToFavoriteList(noteDto: noteDto) {
    if (!this.isPending) {
      let warningText1 = 'Favorite Change';
      let warningText2 = noteDto.isFavorite ?
        'Are you sure to remove this note from your favorites?'
        :
        'Are you sure to add this note to your favorites?';

      this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
        if (userConfirm) {
          this.noteService.addOrRemoveNoteToUserFavList(noteDto.id, !noteDto.isFavorite)
            .subscribe({
              next: () => {
                this.findNoteByIdAndDoTheOperationsWithIt('favoriteChange', noteDto.id);
                this.isPending = false;
              },
              error: (response) => {
                this.globalService.isExpiredToken(response);
                this.isPending = false;
              }
            });
        }
      });
    }
  }

  changeVisibility(noteDto: noteDto) {
    if (!this.isPending) {
      let warningText1 = 'Visibility Change';
      let warningText2 = noteDto.visibilityOnlyForMe ?
        'If you set the visibility to PUBLIC<br>Every user will able to see this note'
        :
        'If you set the visibility to PRIVATE<br>Only you will able to see this note';

      this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
        if (userConfirm) {
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
      });
    }
  }

  onScrollDown(event: any) {
    if (this.pagInfo.totalPages - this.pagInfo.actualPage > 1) {
      this.showNotes(this.currentlyRouteAfterNotesTag, ++this.pagInfo.actualPage);
    }
  }

  private openWarnDialog(warningText1: string, warningText2: string): Observable<any> {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = '';

    dialogConfig.data = {
      warningText1: warningText1,
      warningText2: warningText2
    }

    let dialog = this.dialogRef.open(WarnDialogComponent, dialogConfig);
    return dialog.afterClosed();
  }

  changeVideoRef(event: any) {
    this.player = event.target;
  }

  stopVideoWhenScrollStart() {
    if (!this.player.paused) {
      this.player.pause();
    }
  }

  ngOnDestroy(): void {
    this.topicSubscription.unsubscribe();
    this.cancelAllLiveSubs(this.noteSubscriptions);
  }

}
