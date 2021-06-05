


import { Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ConfirmDialogComponent {


  public confirmMessage: string;
  public type : string;
  public warningMessage: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ConfirmDialogComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
      this.warningMessage = data.warningMessage || this.warningMessage;
    }
  }

}
