import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthenticateService } from '../config/authenticate.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isNotesRoute: boolean = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthenticateService, private router: Router) { }

  ngOnInit(): void {
    //checking the currently route
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        let currentUrl = event.urlAfterRedirects;
        this.isNotesRoute = currentUrl.startsWith('/notes/');
      }
    });
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

}
