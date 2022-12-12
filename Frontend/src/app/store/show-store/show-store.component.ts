import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-store',
  templateUrl: './show-store.component.html',
  styleUrls: ['./show-store.component.scss']
})
export class ShowStoreComponent implements OnInit {
  isPending = false;

  constructor() { }

  ngOnInit(): void {
  }

}
