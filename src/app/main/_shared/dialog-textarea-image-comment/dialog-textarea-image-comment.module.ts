import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';
import { DialogTextareaImageCommentComponent} from './dialog-textarea-image-comment.component';

@NgModule({
    declarations: [
      DialogTextareaImageCommentComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule,
        FormsModule
    ],
    entryComponents: [
      DialogTextareaImageCommentComponent
    ]
})
export class  DialogTextareaImageCommentModule
{
}
