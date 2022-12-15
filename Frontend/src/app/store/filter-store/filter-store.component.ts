import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { filter, Subscription } from 'rxjs';
import { storeFilter } from '../config/store-filter.model';
import { StoreService } from '../config/store.service';

@Component({
  selector: 'app-filter-store',
  templateUrl: './filter-store.component.html',
  styleUrls: ['./filter-store.component.scss']
})
export class FilterStoreComponent implements OnInit {
  isPending = false;
  filterForm: FormGroup
  opSystems: string[] = ['Windows', 'Mac', 'Linux'];
  languages: string[] = ['English', 'Hungarian', 'German'];
  genres: string[] = ['Action', 'Indie', 'RPG'];
  categories: string[] = ['Steam Cloud', 'Full controller support', 'MMO'];
  isShowFullFilter = false;
  formValueChangeSub: Subscription;

  constructor(private storeService: StoreService) { }

  ngOnInit(): void {
    this.createFilterForm();
    this.formValueChangeSub = this.filterForm.valueChanges.subscribe((data) => {
      let filter: storeFilter = new storeFilter(data);
      this.storeService.storeFilter.next(filter);
    });
  }

  createFilterForm() {
    return this.filterForm = new FormGroup({
      'sortByField': new FormControl('name'),
      'isAscending': new FormControl(true),
      'languages': new FormControl(['English']),
      'genres': new FormControl([]),
      'opSystems': new FormControl([]),
      'categories': new FormControl([]),
      'isHideFreeGames': new FormControl(false),
      'isHideMyOwnGames': new FormControl(false),
      'isHideMyWishlistGames': new FormControl(false),
      'price': new FormControl(75),
      'showOnlyAdultGames': new FormControl(false),
      'isHideAdultGames': new FormControl(true)

    });
  }

  //convenience getter for easy access to form fields
  get formControl(): { [key: string]: AbstractControl; } {
    return this.filterForm.controls;
  }

  get priceWithText(): string {
    let resultText = '';
    let actualPrice = this.formControl['price'].value;
    actualPrice === 0 ? resultText = 'Free' : '';
    actualPrice === 75 ? resultText = 'Any Price' : '';
    actualPrice > 0 && actualPrice < 75 ? resultText = 'Under ' + actualPrice + ' €' : '';
    return resultText;
  }

  get allFilterResult(): number {
    return this.storeService.allFilterResult;
  }

  changeCloseOrOpenFilterPanel() {
    this.isShowFullFilter = !this.isShowFullFilter;
  }




}
