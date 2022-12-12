import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, OnInit } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { FIXED_SIZES } from 'src/app/config/strings.enum';

@Component({
  selector: 'app-navigation-mobile-notes',
  templateUrl: './navigation-mobile-notes.component.html',
  styleUrls: ['./navigation-mobile-notes.component.scss']
})
export class NavigationMobileNotesComponent implements OnInit {
  deviceHeight = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  constructor(private breakpointObserver: BreakpointObserver,) { }

  ngOnInit(): void {
    this.deviceHeight = window.innerHeight - FIXED_SIZES.MOBILE_MENU_HEIGHT_FROM_BOTTOM;
  }

  // update value when resize
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.deviceHeight = window.innerHeight - FIXED_SIZES.MOBILE_MENU_HEIGHT_FROM_BOTTOM;
  }

}
