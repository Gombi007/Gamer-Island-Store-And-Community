import { Component } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { AdminService } from '../config/admin.service';

@Component({
  selector: 'app-admin-add-games',
  templateUrl: './admin-add-games.component.html',
  styleUrls: ['./admin-add-games.component.scss']
})
export class AdminAddGamesComponent {
  isSavingInProgress: boolean = false;
  savedGames: string[] = [];
  repeatGameSaveQuerryTime = interval(360000);
  subSaveGamesInterval: Subscription;
  subsSaveGame: Subscription[] = [];
  actualSavingCircle: number = 0;
  maximumSavingCircle: number = 20;

  constructor(private adminService: AdminService, private globalService: GlobalService) { }

  doSaving() {
    if (this.subSaveGamesInterval === undefined || this.subSaveGamesInterval.closed) {
      this.isSavingInProgress = true;
      this.actualSavingCircle++;
      this.saveGamesFromSteamToDb();
      this.subSaveGamesInterval = this.repeatGameSaveQuerryTime
        .pipe(take(this.maximumSavingCircle - 1))
        .subscribe(() => {
          this.actualSavingCircle++;
          this.saveGamesFromSteamToDb();
        });

    } else {
      this.subSaveGamesInterval.unsubscribe();
      if (this.subsSaveGame.length > 0) {
        this.subsSaveGame.forEach(sub => { sub.unsubscribe() })
        this.subsSaveGame = [];
      }
      this.isSavingInProgress = false;
      this.actualSavingCircle = 0;
    }
  }

  saveGamesFromSteamToDb() {
    this.subsSaveGame.push(this.adminService.saveNewGamesFromSteamToDb().subscribe({
      next: (data: any) => {
        this.savedGames = data;
        if (this.actualSavingCircle === this.maximumSavingCircle) {
          this.isSavingInProgress = false;
          this.actualSavingCircle = 0
        }
      },
      error: (response) => {
        this.isSavingInProgress = false;
        this.actualSavingCircle = 0
        this.globalService.isExpiredToken(response);
      }
    }));
  }

  ngOnDestroy(): void {
    if (this.subSaveGamesInterval !== undefined) {
      this.subSaveGamesInterval.unsubscribe();
    }
    if (this.subsSaveGame.length > 0) {
      this.subsSaveGame.forEach(sub => { sub.unsubscribe() })
      this.subsSaveGame = [];
    }
  }

}
