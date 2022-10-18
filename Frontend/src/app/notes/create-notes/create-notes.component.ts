import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { map, tap } from 'rxjs';
import { noteDtoToPost } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit {

  isPending = false;
  createNoteForm: FormGroup;

  constructor(private noteService: NoteService) { }

  ngOnInit(): void {
    this.createTheForm();

  }

  createTheForm() {
    return this.createNoteForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      'text': new FormControl(null, [Validators.required, Validators.maxLength(160)]),
      'imageUrl': new FormControl(null),
      'isUrgent': new FormControl(null),
    });
  }

  onSubmit() {
    if (this.createNoteForm.valid) {

      let note: noteDtoToPost = new noteDtoToPost(
        this.createNoteForm.get('title')?.value,
        this.createNoteForm.get('text')?.value,
        this.createNoteForm.get('isUrgent')?.value,
        this.createNoteForm.get('imageUrl')?.value,
      );

      this.noteService.createNote(note)
        .pipe(
          tap(() => this.isPending = true))
        .subscribe(
          {
            next: () => {
              this.isPending = false;
            }
          });
      this.createNoteForm.reset();
    }
  }

}
