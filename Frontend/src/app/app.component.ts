import { Component } from '@angular/core';
import { ConfigService } from './config/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My-notes';
  notes: noteDto[] = [];


  constructor(private service: ConfigService) { }

  showNotes() {
    this.service.getNotes('').subscribe((data: noteDto[]) => {
      this.notes = data;
    });
  }

}

export class noteDto {
  id: string = "";
  text: string = "";
  text2: string = "";
  isUrgent: boolean = false;
  created: string = "";
  lastModified: string = "";
  imgUrl: string = "";
}