import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, timer } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { WarnDialogComponent } from 'src/app/warn-dialog/warn-dialog.component';
import { noteDto } from '../config/note.model';
import { NoteService } from '../config/note.service';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit, OnDestroy {

  @ViewChild('form') form: FormGroupDirective;

  isPending = false;
  notifyUserText: string = '';
  buttonLabel = 'Create';
  createNoteForm: FormGroup;
  clickedUrlBtn = "";


  constructor(private noteService: NoteService, private router: Router, private globalService: GlobalService, private dialogRef: MatDialog) { }

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
      'title': new FormControl('', [Validators.required, Validators.maxLength(40)]),
      'text': new FormControl('', [Validators.required, Validators.maxLength(160)]),
      'link': new FormControl(''),
      'imgUrl': new FormControl(''),
      'ytUrl': new FormControl(''),
      'videoPosterUrl': new FormControl(''),
      'videoUrl': new FormControl(''),
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
      'videoPosterUrl': modifyNote.videoPosterUrl,
      'videoUrl': modifyNote.videoUrl,
      'isFavorite': modifyNote.isFavorite,
      'visibilityOnlyForMe': modifyNote.visibilityOnlyForMe
    });
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
            this.notifyUserText = 'The note was created successfully!';
            timer(2000).subscribe(
              () => this.notifyUserText = ''
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
            this.notifyUserText = 'The note was modified successfully!';
            timer(2000).subscribe(
              () => this.notifyUserText = ''
            );
          },
          error: (response) => {
            this.globalService.isExpiredToken(response);
            this.isPending = false;
          }
        });
    }
  }

  cancelModifyAndBack() {
    let isEmptyFrom = true;
    let warningText1 = 'You will lost the all unsaved data!';
    let warningText2 = 'Are you sure to go back?';

    Object.keys(this.createNoteForm.controls).forEach(key => {
      let controlValue = this.createNoteForm.controls[key].value;
      if (typeof controlValue !== "boolean" && controlValue !== null && controlValue !== '') {
        isEmptyFrom = false;
      }
    });

    if (isEmptyFrom) {
      this.noteService.noteToModify = undefined;
      this.router.navigate([this.noteService.cancelModifyOrSubmitAndGoBack]);
    }

    if (!isEmptyFrom) {
      this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm) => {
        if (userConfirm) {
          this.noteService.noteToModify = undefined;
          this.router.navigate([this.noteService.cancelModifyOrSubmitAndGoBack]);
        }
      });
    }
  }



  addImageOrVideoLink(label: string) {
    let warningText1 = 'If you switch the media tab..<br>You will lost the current media data.';
    let warningText2 = 'Are you sure to swicth media tab?';
    let isEmptyAllMediaUrlField = true;

    Object.keys(this.createNoteForm.controls).forEach((key: string) => {
      let controlValue: string = this.createNoteForm.controls[key].value;
      if (key.toLocaleLowerCase().includes('url') && controlValue !== null && controlValue.length > 0) {
        isEmptyAllMediaUrlField = false;
      }
    });

    if (isEmptyAllMediaUrlField) {
      this.changeMediaTypeInForm(label);
    }

    if (!isEmptyAllMediaUrlField) {
      this.openWarnDialog(warningText1, warningText2).subscribe((userConfirm: boolean) => {
        if (userConfirm) {
          Object.keys(this.createNoteForm.controls).forEach((key: string) => {
            key.toLocaleLowerCase().includes('url') ? this.createNoteForm.controls[key].setValue('') : '';
          });
          this.changeMediaTypeInForm(label);
        }
      });
    }
  }

  private openWarnDialog(warningText1: string, warningText2: string): Observable<any> {
    let dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = '';

    dialogConfig.data = {
      warningText1: warningText1,
      warningText2: warningText2
    }

    let dialog = this.dialogRef.open(WarnDialogComponent, dialogConfig);
    return dialog.afterClosed();
  }

  private changeMediaTypeInForm(label: string) {
    if (label === this.clickedUrlBtn) {
      this.clickedUrlBtn = "";
    } else {
      this.clickedUrlBtn = label;
    }
  }

  private checkWhatUrlIsPresent() {
    let givenUrlFieldName = '';
    Object.keys(this.createNoteForm.controls).forEach((key: string) => {
      let controlValue: string = this.createNoteForm.controls[key].value;
      if (key.toLocaleLowerCase().includes('url') && controlValue !== null && controlValue.length > 0)
        givenUrlFieldName = key;
    });
    return givenUrlFieldName;
  }

  ngOnDestroy(): void {
    this.noteService.noteToModify = undefined;
  }
}
