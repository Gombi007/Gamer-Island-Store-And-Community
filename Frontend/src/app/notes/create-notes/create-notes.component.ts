import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit {

  isUrgent = [true, false]
  createNoteForm: FormGroup;

  constructor() { }

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
      this.createNoteForm.reset();
    }


  }

}
