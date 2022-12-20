import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
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
  formValueChangeSub: Subscription;

  constructor(private storeService: StoreService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.getGenresAndLanguagesAndCategories();
    this.createFilterForm();
    this.formValueChangeSub = this.filterForm.valueChanges.subscribe((data) => {
      let filter: storeFilter = new storeFilter(data);
      this.storeService.storeFilter.next(filter);
    });
  }

  createFilterForm() {
    return this.filterForm = new FormGroup({
      'sortByField': new FormControl('name', { nonNullable: true }),
      'isAscending': new FormControl('true', { nonNullable: true }),
      'languages': new FormControl([], { nonNullable: true }),
      'genres': new FormControl([], { nonNullable: true }),
      'opSystems': new FormControl([], { nonNullable: true }),
      'categories': new FormControl([], { nonNullable: true }),
      'isHideFreeGames': new FormControl(false, { nonNullable: true }),
      'isHideMyOwnGames': new FormControl(false, { nonNullable: true }),
      'isHideMyWishlistGames': new FormControl(false, { nonNullable: true }),
      'price': new FormControl(75, { nonNullable: true }),
      'showOnlyAdultGames': new FormControl(false, { nonNullable: true }),
      'isHideAdultGames': new FormControl(true, { nonNullable: true })
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

  get isShowFullFilterWindow(): boolean {
    return this.storeService.showFullFilterWindow;
  }

  changeCloseOrOpenFilterPanel() {
    this.storeService.showFullFilterWindow = !this.isShowFullFilterWindow;
  }

  getGenresAndLanguagesAndCategories() {
    this.isPending = true
    this.storeService.getGenresAndLanguagesAndCategories().subscribe({
      next: (data) => {
        this.languages = data.languages;
        this.genres = data.genres;
        this.categories = data.categories;
        this.isPending = false;
      },
      error: (response) => {
        this.globalService.isExpiredToken(response);
        console.log(response);
        this.isPending = false;
      }
    });
  }

  resetFilter() {
    this.filterForm.reset();
  }

}
