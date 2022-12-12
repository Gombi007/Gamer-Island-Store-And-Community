import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-store',
  templateUrl: './filter-store.component.html',
  styleUrls: ['./filter-store.component.scss']
})
export class FilterStoreComponent implements OnInit {
  isPending = false;

  constructor() { }

  ngOnInit(): void {
  }

}
