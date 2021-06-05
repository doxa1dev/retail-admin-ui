import { Component, Inject , ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector   : 'common-dialog',
    templateUrl: './common-dialog.component.html',
    styleUrls  : ['./common-dialog.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CommonDialogComponent
{
    public confirmMessage: string;
    public title: string;
    public colorButton: boolean;
    buttonRed = '#de3535';
    buttonGreen = '#7DA863';
    public type: string;
    public buttonName: string;
    /**
     * Constructor
     *
     * @param {MatDialogRef<CommonDialogComponent>} dialogRef
     */
    constructor(
        public dialogRef: MatDialogRef<CommonDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            if(data){
                this.confirmMessage = data.message || this.confirmMessage;
                this.title = data.title || "CONFIRM";
                this.colorButton = data.colorButton || this.colorButton;
                this.type = data.type;
                this.buttonName = data.buttonName || 'OK'
            }
        }

}
