import { Component, OnInit, Inject, ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogConfirmComponent {

  public title: string;
  public confirmMessage: string;
  public buttonLeft: string;
  public buttonRight: string;
  /**
   * Constructor
   *
   * @param {MatDialogRef<DialogConfirmComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.title = data.title || 'CONFIRM';
      this.buttonLeft = data.buttonLeft || 'CANCEL';
      this.buttonRight = data.buttonRight || 'OK';
    }
  }

}
