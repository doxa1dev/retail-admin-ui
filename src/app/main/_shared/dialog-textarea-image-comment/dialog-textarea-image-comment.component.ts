import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrdersService } from 'app/core/service/orders.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-dialog-textarea-image-comment',
  templateUrl: './dialog-textarea-image-comment.component.html',
  styleUrls: ['./dialog-textarea-image-comment.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class DialogTextareaImageCommentComponent implements OnInit {

  public confirmMessage: string;
  public type : string;
  checkComments : boolean = true;
  buttonGreen = '#7DA863';
  buttonGrey = 'grey';
  comments : any;
  image : string;
  url: string;
  text: string;
  storageUrl = environment.storageUrl;
  /**
   * Constructor
   *
   * @param {MatDialogRef<DialogTextareaImageCommentComponent>} dialogRef
   */
  constructor(
    private orderService: OrdersService,
    public dialogRef: MatDialogRef<DialogTextareaImageCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
    if (data)
    {
      this.confirmMessage = data.message || this.confirmMessage;
      this.type = data.type || this.type;
    }
  }

  ngOnInit(): void {
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
    this.dialogRef.close({state:true , data: {comment: this.comments , image: this.image}})
  }

  onSelectFile(event) {
    // console.log(event)
    if (event.target.files && event.target.files[0]) {
      if ( event.target.files[0].size > 4 * 1024 * 1024){
        this.url = "";
        return false
      } else {
        const file = event.target.files[0]
        this.text = file.name
        // this.checkValidateFile = false
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event:any) => {
          this.url = event.target.result;
          this.orderService.getPreSignedUrl(Date.now().toString()+ file.name, file.type).subscribe(
            respone => {
              if (respone.code === 200){
                let signUrl = respone.url
                let photoKey = respone.key
                //upload file to S3
                this.orderService.uploadOrderImage(signUrl, file.type, file).subscribe(data => {
                  this.image = photoKey
                  // console.log(this.image)
                });
              }
            }
          )
      }
      }
    }
  }

  deleteImage(){
    this.text = "";
    this.image = null;
  }

}
