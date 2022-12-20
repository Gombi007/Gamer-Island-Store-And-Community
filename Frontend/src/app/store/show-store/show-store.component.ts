import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { PagInfo } from 'src/app/config/pag-info.model';
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

  constructor(private storeService: StoreService, private globalService: GlobalService, private route: ActivatedRoute) { }

  ngOnInit(): void {

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

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => {
        sub.unsubscribe();
      })
    }
  }
}
