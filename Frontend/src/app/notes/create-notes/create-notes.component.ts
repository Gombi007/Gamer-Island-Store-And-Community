import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, timer } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit {

  @ViewChild('form') form: FormGroupDirective;

  isPending = false;
  isSuccess = false;
  isModifySuccess = false;
  buttonLabel = 'Create';
  createNoteForm: FormGroup;
  clickedUrlBtn = "";


  constructor(private noteService: NoteService, private router: Router, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.createTheForm();
    if (this.noteService.noteToModify !== undefined) {
      this.buttonLabel = 'Modify';
      this.modifyNoteFormSetter(this.noteService.noteToModify, this.createNoteForm)
      this.clickedUrlBtn = this.checkWhatUrlIsPresent();
    }

  }

  createTheForm() {
    return this.createNoteForm = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.maxLength(30)]),
      'text': new FormControl(null, [Validators.required, Validators.maxLength(160)]),
      'link': new FormControl(null),
      'imgUrl': new FormControl(null),
      'ytUrl': new FormControl(null),
      'videoUrl': new FormControl(null),
      'videoPosterUrl': new FormControl(null),
      'isFavorite': new FormControl(false),
      'visibilityOnlyForMe': new FormControl(true),
    });
  }

  modifyNoteFormSetter(modifyNote: noteDto, form: FormGroup) {
    form.setValue({
      'title': modifyNote.title,
      'text': modifyNote.text,
      'link': modifyNote.link,
      'imgUrl': modifyNote.imgUrl,
      'ytUrl': modifyNote.ytUrl,
      'videoUrl': modifyNote.videoUrl,
      'videoPosterUrl': modifyNote.videoUrl,
      'isFavorite': modifyNote.isFavorite,
      'visibilityOnlyForMe': modifyNote.visibilityOnlyForMe
    });
  }


  cancelModifyAndBack() {
    this.noteService.noteToModify = undefined;
    this.router.navigate([this.noteService.cancelModifyOrSubmitAndGoBack]);
  }

  onSubmit() {
    this.isPending = true;
    if (this.createNoteForm.valid && this.noteService.noteToModify === undefined) {
      this.noteService.createNote(this.createNoteForm).subscribe(
        {
          next: () => {
            this.createTheForm();
            this.form.resetForm();
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
      this.noteService.modifyNote(this.createNoteForm, this.noteService.noteToModify.id).subscribe(
        {
          next: () => {
            this.createTheForm();
            this.form.resetForm();
            this.noteService.noteToModify = undefined;
            this.buttonLabel = 'Create'
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

  addImageOrVideoLink(label: string) {
    //set link to empty when the button was click, only if not a modify progress
    //only one saveable of these 3 options  
    this.createNoteForm.controls['imgUrl'].setValue('');
    this.createNoteForm.controls['ytUrl'].setValue('');
    this.createNoteForm.controls['videoUrl'].setValue('');

    if (label === this.clickedUrlBtn) {
      this.clickedUrlBtn = "";
    } else {
      this.clickedUrlBtn = label;
    }
  }

  checkWhatUrlIsPresent() {
    let givenUrlFieldName = '';
    if (this.createNoteForm.controls['imgUrl'].value !== '') {
      givenUrlFieldName = 'imgUrl';
    }

    if (this.createNoteForm.controls['ytUrl'].value !== '') {
      givenUrlFieldName = 'ytUrl';
    }

    if (this.createNoteForm.controls['videoUrl'].value !== '') {
      givenUrlFieldName = 'videoUrl';
    }
    return givenUrlFieldName;
  }



}
