import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config/config.service';
import { noteDto } from 'src/app/config/dtos';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  notes: noteDto[] = [];
  constructor(private service: ConfigService) { }

  ngOnInit(): void {
    this.showNotes();
  }

  showNotes() {
    this.service.getNotes('').subscribe((data: noteDto[]) => {
      this.notes = data;
    })
  }

}
