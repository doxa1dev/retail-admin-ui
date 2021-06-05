import { Component, OnInit, Inject , ViewEncapsulation} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dialog-select-date-naep',
  templateUrl: './dialog-select-date-naep.component.html',
  styleUrls: ['./dialog-select-date-naep.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DialogSelectDateNaepComponent implements OnInit {

  public confirmMessage: string;
  public title: string;
  public colorButton: boolean;
  minDateStart: Date;
  date : Date;
  dateSend: string;
  disableButton: boolean = true;
  buttonGreen = '#269A3E';
  buttonGrey = 'grey';
  validDates;
  /**
     * Constructor
     *
     * @param {MatDialogRef<DialogSelectDateNaepComponent>} dialogRef
     */
    constructor(
      public dialogRef: MatDialogRef<DialogSelectDateNaepComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
      ) {
          if(data){
              this.confirmMessage = data.message || this.confirmMessage;
              this.title = data.title || this.title;
              this.colorButton = data.colorButton || this.colorButton;
              this.minDateStart = new Date(data.date) ;
          }
      }

    ngOnInit(){}

    events: string;

    addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
      this.events = `${event.value}`;
      // this.dateSend = formatDate(this.events, 'dd/MM/yyyy', 'en-US' )
      this.disableButton = false
      // console.log(this.events)
    }

    checkOK(){
      this.dialogRef.close({state:true , date: this.events})
    }

}
