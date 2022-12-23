import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from 'src/app/config/authorization.service';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
import { WarnDialogComponent } from 'src/app/user-indicators/warn-dialog/warn-dialog.component';
import { storeFilter } from '../config/store-filter.model';
import { storeGame } from '../config/store-game.model';
import { StoreService } from '../config/store.service';

@Component({
  selector: 'app-show-store',
  templateUrl: './show-store.component.html',
  styleUrls: ['./show-store.component.scss']
})
export class ShowStoreComponent implements OnInit, OnDestroy {
  isPending = false;
  defaultGames: storeGame[] = [];
  pagInfo: PagInfo = new PagInfo(0, 0, 0);
  isFilterOn: boolean = false;
  subscriptions: Subscription[] = [];
  filterResult: storeFilter;
  isShowFilter = false;
  hasAdminRole: boolean = false;

  constructor(private storeService: StoreService, private globalService: GlobalService, private authorServie: AuthorizationService, private dialogRef: MatDialog) { }

  ngOnInit(): void {
    this.authorServie.hasRoleAdmin().subscribe((data: boolean) => {
      this.hasAdminRole = data;
    });

    let storeFilterSub = this.storeService.storeFilter.subscribe((storeFilter: storeFilter) => {
      if (storeFilter !== null) {
        this.defaultGames = [];
        this.filterResult = storeFilter;
        this.getAllDefaultGames(0, this.filterResult);
      }
    })

    this.getAllDefaultGames(0, this.filterResult);
    this.subscriptions.push(storeFilterSub);
  }

  getAllDefaultGames(page: number, filterResult: storeFilter) {
    this.isPending = true;
    this.storeService.getAllDefaultGames(page, filterResult).subscribe({
      next: (data) => {
        this.pagInfo = data.paginationInfo;
        this.defaultGames.length > 0 ? this.defaultGames = this.defaultGames.concat(data.page) : this.defaultGames = data.page;
        this.storeService.allFilterResult = this.pagInfo.totalElements;
        this.isPending = false;
      },
      error: (response) => {
        this.globalService.isExpiredToken(response);
        console.log(response);
        this.isPending = false;
      }
    });
  }

  onScrollDown(event: any) {
    if (this.pagInfo.totalPages - this.pagInfo.actualPage > 1) {
      this.getAllDefaultGames(++this.pagInfo.actualPage, this.filterResult);
    }
  }

  adminRemoveGame(gameId: string, gameName: string) {
    let warningText1 = 'ADMIN REMOVE';
    let warningText2 = 'Are you sure to remove this?<br><b>' + gameName + '</b><br>This game will not be recoverable!'

    this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
      if (userConfirm) {
        this.isPending = true;
        this.storeService.adminRemoveGame(gameId).subscribe({
          next: () => {
            this.isPending = false;
          },
          error: (response: any) => {
            console.log(response);
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });
      }
    });
  }

  adminMarkAsAdultGame(gameId: string, gameName: string) {
    let warningText1 = 'ADMIN MARK AS ADULT CONTENT';
    let warningText2 = 'Are you sure to mark this:<br><b>' + gameName + '</b><br> to adult content?'

    this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
      if (userConfirm) {
        this.isPending = true;
        this.storeService.adminMarkAsAdult(gameId).subscribe({
          next: () => {
            this.isPending = false;
          },
          error: (response: any) => {
            console.log(response);
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });
      }
    });
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

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      })
    }
  }
}
