import { Component, Inject , ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder , FormsModule } from '@angular/forms';
import { isNullOrUndefined } from 'util';
@Component({
  selector: 'app-dialog-input',
  templateUrl: './dialog-input.component.html',
  styleUrls: ['./dialog-input.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogInputComponent implements OnInit {

  public confirmMessage: string;
  public colorButton: boolean;
  form: FormGroup;
  uuid: string;
  buttonRed = '#de3535';
  buttonGreen = '#7DA863';
  buttonGrey = 'grey';
  disableButton: boolean = true;
  input: any;
    /**
     * Constructor
     *
     * @param {MatDialogRef<DialogInputComponent>} dialogRef
     */
  constructor(
    public dialogRef: MatDialogRef<DialogInputComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data){
      this.confirmMessage = data.message || this.confirmMessage;
      this.uuid = data.uuid || this.uuid;
    }
  }

  ngOnInit(){
    $("#input").keyup(()=>{
      // console.log($("#input").val())
        if(!isNullOrUndefined($("#input").val()) && ($("#input").val()) != '' && /^[0-9]+$/.test($("#input").val().toString()) ){
          this.disableButton = false
        }else{
          this.disableButton = true;
        }
    })
  }

  update(){
    this.input =  $("#input").val();
    this.dialogRef.close({state:true , data: this.input});
  }

}
