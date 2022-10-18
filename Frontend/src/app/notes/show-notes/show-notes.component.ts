import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-show-notes',
  templateUrl: './show-notes.component.html',
  styleUrls: ['./show-notes.component.scss']
})
export class ShowNotesComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  currentlyRoute = '';
  notes: noteDto[] = [];

  constructor(private noteService: NoteService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (param: Params) => {
        this.currentlyRoute = param['urgent'];
        this.showNotes(this.currentlyRoute);
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

  removeNote(noteId: string) {
    this.noteService.removeNote(noteId).subscribe({
      next: () => {
        this.showNotes(this.currentlyRoute);
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    });
  }

  editNote(note: noteDto) {
    this.noteService.noteToModify = note;
    this.router.navigate(['/notes/add/create-note'])
  }

}
