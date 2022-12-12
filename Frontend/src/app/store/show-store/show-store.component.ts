import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
import { storeGame } from '../config/store-game.model';
import { StoreService } from '../config/store.service';

@Component({
  selector: 'app-show-store',
  templateUrl: './show-store.component.html',
  styleUrls: ['./show-store.component.scss']
})
export class ShowStoreComponent implements OnInit {
  isPending = false;
  defaultGames: storeGame[] = [];
  pagInfo: PagInfo = new PagInfo(0, 0, 0);

  constructor(private storeService: StoreService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.getAllDefaultGames();
  }

  getAllDefaultGames() {
    this.isPending = true;
    this.storeService.getAllDefaultGames(0).subscribe({
      next: (data) => {
        this.defaultGames = data.page;
        this.pagInfo = data.paginationInfo;
        this.isPending = false;
      },
      error: (response) => {
        this.globalService.isExpiredToken(response);
        console.log(response);
        this.isPending = false;
      }
    });
  }

}
