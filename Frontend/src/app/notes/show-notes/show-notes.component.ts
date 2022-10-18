import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-show-notes',
  templateUrl: './show-notes.component.html',
  styleUrls: ['./show-notes.component.scss']
})
export class ShowNotesComponent implements OnInit {

  notes: noteDto[] = [];

  constructor(private noteService: NoteService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.showNotes();
    this.route.params.subscribe(
      (param: Params) => {
        this.showNotes(param['urgent']);
      }
    );
  }

  showNotes(isUrgent: string = '') {
    if (isUrgent === '' || isUrgent === 'all') {
      this.noteService.getNotes().subscribe({
        next: (data) => this.notes = data
      });
    }

    if (isUrgent === 'urgent') {
      this.noteService.getNotesWithIsUrgentParam('true').subscribe({
        next: (data) => this.notes = data
      });
    }
    if (isUrgent === 'non-urgent') {
      this.noteService.getNotesWithIsUrgentParam('false').subscribe({
        next: (data) => this.notes = data
      });
    }
  }

}
