import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, timer } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { noteDto, noteDtoToPost } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit {

  isPending = false;
  isSuccess = false;
  isModifySuccess = false;
  buttonLabel = 'Create';
  createNoteForm: FormGroup;

  constructor(private noteService: NoteService, private router: Router, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.createTheForm();
    if (this.noteService.noteToModify !== undefined) {
      this.buttonLabel = 'Modify';
      this.modifyNoteFormSetter(this.noteService.noteToModify, this.createNoteForm)
    }

  }

  createTheForm() {
    return this.createNoteForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      'text': new FormControl(null, [Validators.required, Validators.maxLength(160)]),
      'imageUrl': new FormControl(null),
      'isUrgent': new FormControl(false),
    });
  }

  modifyNoteFormSetter(modifyNote: noteDto, form: FormGroup) {
    form.setValue({
      'title': modifyNote.text,
      'text': modifyNote.text2,
      'imageUrl': modifyNote.imgUrl,
      'isUrgent': modifyNote.isUrgent,
    });
  }

  collectDataFromForm(): noteDtoToPost {
    return new noteDtoToPost(
      this.createNoteForm.get('title')?.value,
      this.createNoteForm.get('text')?.value,
      this.createNoteForm.get('isUrgent')?.value,
      this.createNoteForm.get('imageUrl')?.value,
    );
  }

  cancelModifyAndBack() {
    this.noteService.noteToModify = undefined;
    this.router.navigate([this.noteService.cancelModifyOrSubmitAndGoBack]);
  }

  onSubmit() {
    this.isPending = true;
    let collectedFormData = this.collectDataFromForm();
    if (this.createNoteForm.valid && this.noteService.noteToModify === undefined) {
      this.noteService.createNote(collectedFormData).subscribe(
        {
          next: () => {
            this.createNoteForm.reset();
            this.isPending = false;
            this.isSuccess = true;
            timer(2000).subscribe(
              () => this.isSuccess = false
            );
          },
          error: (response) => {
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });
    }
    if (this.createNoteForm.valid && this.noteService.noteToModify !== undefined) {
      this.noteService.modifyNote(collectedFormData, this.noteService.noteToModify.id).subscribe(
        {
          next: () => {
            this.createNoteForm.reset();
            this.noteService.noteToModify = undefined;
            this.isPending = false;
            this.isModifySuccess = true;
            timer(2000).subscribe(
              () => this.isModifySuccess = false
            );
          },
          error: (response) => {
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });

    }

  }

}
