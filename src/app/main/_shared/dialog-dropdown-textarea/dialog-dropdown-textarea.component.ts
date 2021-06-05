import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-dropdown-textarea',
    templateUrl: './dialog-dropdown-textarea.component.html',
    styleUrls: ['./dialog-dropdown-textarea.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DialogDropdownTextareaComponent implements OnInit {

    formComment: FormGroup;
    showError: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<DialogDropdownTextareaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
    ) {
        this.formComment = this.fb.group({
            commentSelect: [null, Validators.required],
            commentEnter: ['', Validators.required],
        })
    }

    ngOnInit(): void {

    }

    back() {
        this.dialogRef.close({ state: false, data: {} });
    }

    submit() {
        this.showError = true;
        if (this.formComment.invalid) return;
        let comment = "";
        const { commentSelect, commentEnter } = this.formComment.getRawValue();
        comment = commentSelect ? commentSelect.value : "";
        comment += comment ? (commentEnter ? `, ${commentEnter}` : "") : "";
        this.dialogRef.close({ state: true, data: { comment } });
    }
}
