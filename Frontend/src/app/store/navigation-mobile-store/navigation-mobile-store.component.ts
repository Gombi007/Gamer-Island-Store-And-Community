import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Component({
  selector: 'app-navigation-mobile-store',
  templateUrl: './navigation-mobile-store.component.html',
  styleUrls: ['./navigation-mobile-store.component.scss']
})
export class NavigationMobileStoreComponent implements OnInit {

  deviceHeight = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver,) { }

  ngOnInit(): void {
    this.deviceHeight = window.innerHeight - 60;
  }

  // update value when resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.deviceHeight = window.innerHeight - 60;
  }

}
