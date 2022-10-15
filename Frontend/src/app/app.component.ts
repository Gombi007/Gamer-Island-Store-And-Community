import { Component } from '@angular/core';
import { ConfigService } from './config/config.service';
import { noteDto } from './config/dtos';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My-notes';
}

