import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-notes',
  templateUrl: './create-notes.component.html',
  styleUrls: ['./create-notes.component.scss']
})
export class CreateNotesComponent implements OnInit {
  @ViewChild('f') submitForm: NgForm;
  genders = ['male', 'female']
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.submitForm.reset();

  }

}
