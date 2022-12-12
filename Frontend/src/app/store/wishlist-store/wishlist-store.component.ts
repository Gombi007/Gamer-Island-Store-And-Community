import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wishlist-store',
  templateUrl: './wishlist-store.component.html',
  styleUrls: ['./wishlist-store.component.scss']
})
export class WishlistStoreComponent implements OnInit {
  isPending = false;

  constructor() { }

  ngOnInit(): void {
  }

}
