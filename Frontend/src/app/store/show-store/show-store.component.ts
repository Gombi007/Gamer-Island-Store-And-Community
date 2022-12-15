import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
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
  isFilterOn: boolean = false;

  constructor(private storeService: StoreService, private globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        param['allOrFilter'] === 'filter' ? this.isFilterOn = true : this.isFilterOn = false;
      }
    );
    this.getAllDefaultGames(0);
  }

  getAllDefaultGames(page: number) {
    this.isPending = true;
    this.storeService.getAllDefaultGames(page).subscribe({
      next: (data) => {
        this.pagInfo = data.paginationInfo;
        this.defaultGames.length > 0 ? this.defaultGames = this.defaultGames.concat(data.page) : this.defaultGames = data.page;
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
      this.getAllDefaultGames(++this.pagInfo.actualPage);
    }
  }

}
