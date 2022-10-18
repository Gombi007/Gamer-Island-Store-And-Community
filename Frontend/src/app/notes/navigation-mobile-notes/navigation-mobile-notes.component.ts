import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-mobile-notes',
  templateUrl: './navigation-mobile-notes.component.html',
  styleUrls: ['./navigation-mobile-notes.component.scss']
})
export class NavigationMobileNotesComponent implements OnInit {
  deviceHeight = 0;
  constructor() { }

  ngOnInit(): void {
    this.deviceHeight = window.innerHeight - 60;
  }

  // update value when resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.deviceHeight = window.innerHeight - 60;
  }

}
