import { Component, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  deviceHeight = 0;

  @Input()
  text: string;

  @Input()
  isWarnNotification: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.deviceHeight = window.innerHeight - 100;
  }

  // update value when resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.deviceHeight = window.innerHeight - 100;
  }

}
