import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-textarea-comment',
  templateUrl: './dialog-textarea-comment.component.html',
  styleUrls: ['./dialog-textarea-comment.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogTextareaCommentComponent implements OnInit {

  public confirmMessage: string;
  public type : string;
  checkComments : boolean = true;
  buttonGreen = '#7DA863';
  buttonGrey = 'grey';
  comments : any;
  /**
   * Constructor
   *
   * @param {MatDialogRef<DialogTextareaCommentComponent>} dialogRef
   */
  constructor(
    public dialogRef: MatDialogRef<DialogTextareaCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
    }
  }

  ngOnInit(){
    $("#comment").keyup(()=>{
      if($("#comment").val() != null && $("#comment").val() != undefined && /^\s*$/.test($('#comment').val().toString()) ){
        this.checkComments = true;
      }else{
        this.checkComments = false;
      }
    })
  }

  submitDataComments(){
    this.comments =  $("#comment").val();
    this.dialogRef.close({state:true , data: this.comments})
  }

}
