import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { storeFilter } from '../config/store-filter.model';

@Component({
  selector: 'app-filter-store',
  templateUrl: './filter-store.component.html',
  styleUrls: ['./filter-store.component.scss']
})
export class FilterStoreComponent implements OnInit {
  isPending = false;
  filterForm: FormGroup
  filterDto: storeFilter = new storeFilter();

  constructor() { }

  ngOnInit(): void {
    this.createFilterForm();
  }

  createFilterForm() {
    return this.filterForm = new FormGroup({
      'sortByField': new FormControl('name'),
      'isAscending': new FormControl('true'),
    });
  }

  collectFormData() {
    console.log(this.filterForm.value);

  }

  //convenience getter for easy access to form fields
  get formControl(): { [key: string]: AbstractControl; } {
    return this.filterForm.controls;
  }


}
