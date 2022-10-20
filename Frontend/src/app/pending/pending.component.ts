import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending',
  templateUrl: './pending.component.html',
  styleUrls: ['./pending.component.scss']
})
export class PendingComponent implements OnInit {
  deviceHeight = 0;

  constructor() { }

  ngOnInit(): void {
    this.deviceHeight = window.innerHeight - 115;
  }

  // update value when resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.deviceHeight = window.innerHeight - 115;
  }

}
