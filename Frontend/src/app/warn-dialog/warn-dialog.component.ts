import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warn-dialog',
  templateUrl: './warn-dialog.component.html',
  styleUrls: ['./warn-dialog.component.scss']
})
export class WarnDialogComponent implements OnInit {
  warningText1 = '';
  warningText2 = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialog: MatDialogRef<WarnDialogComponent>) { }

  ngOnInit(): void {
    this.warningText1 = this.data.warningText1;
    this.warningText2 = this.data.warningText2;
  }

  closeWithOK() {
    this.dialog.close(true);
  }

  closeWithCancel() {
    this.dialog.close(false);
  }




}
