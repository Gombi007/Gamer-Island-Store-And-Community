import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MyIconsService } from './config/my-icons.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'My-notes';
  icons = [{ name: 'windows', 'path': 'assets/icon/windows.svg' }, { name: 'mac', 'path': 'assets/icon/mac.svg' }, { name: 'linux', 'path': 'assets/icon/linux.svg' }];

  constructor(private myIconsService: MyIconsService) { }

  ngOnInit(): void {
    this.myIconsService.addMyIconsToMaterial(this.icons);
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

