import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NoteService } from 'src/app/notes/config/note.service';
import { noteDto } from 'src/app/notes/config/note.model';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  notes: noteDto[] = [];

  constructor(private noteService: NoteService) { }

  ngOnInit(): void {
    this.showNotes();
  }

  showNotes(isUrgent: string = '') {
    if (isUrgent === 'true' || isUrgent === 'false') {
      this.noteService.getNotesWithIsUrgentParam(isUrgent).subscribe({
        next: (data) => this.notes = data
      });
    } else {
      this.noteService.getNotes().subscribe({
        next: (data) => this.notes = data
      });
    }
  }
}
