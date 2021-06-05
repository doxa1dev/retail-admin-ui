import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogDropdownTextareaComponent } from './dialog-dropdown-textarea.component';
import {DropdownModule} from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DialogDropdownTextareaComponent],
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DialogDropdownTextareaModule { }
