import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { CommonModule } from '@angular/common';
import { DialogTextareaCommentComponent} from './dialog-textarea-comment.component';

@NgModule({
    declarations: [
      DialogTextareaCommentComponent
    ],
    imports: [
        MatDialogModule,
        MatButtonModule,
        CommonModule
    ],
    entryComponents: [
      DialogTextareaCommentComponent
    ]
})
export class DialogTextareaCommentModule
{
}
