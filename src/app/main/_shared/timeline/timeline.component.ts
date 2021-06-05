import { Component, ViewEncapsulation, Input, OnChanges, SimpleChange} from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.Emulated
})
export class TimelineComponent implements OnChanges {

  constructor(
    private datePipe : DatePipe
  ) {}
  @Input() histories: Array<any>;
  newhistories;

  ngOnChanges(){
    if(!CheckNullOrUndefinedOrEmpty(this.histories))
    {
      if (!CheckNullOrUndefinedOrEmpty(this.histories))
      {
        this.newhistories = [];
        this.histories.forEach(element =>
        {
          if (this.newhistories.length === 0)
          {
            this.newhistories.push({ date: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'), value: [{ action: element.action, time: this.datePipe.transform(element.createdAt, 'HH:mm') , status: element.status , old_data: element.old_data , new_data: element.new_data , comments: element.comment }] })
          }
          else
          {
            let index = this.newhistories.findIndex(e => e.date == this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'))
            if (index === -1)
            {
              this.newhistories.push({ date: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'), value: [{ action: element.action, time: this.datePipe.transform(element.createdAt, 'HH:mm')  , status: element.status , old_data: element.old_data , new_data: element.new_data , comments: element.comment }] })
            }
            else
            {
              this.newhistories[index].value.push({ action: element.action, time: this.datePipe.transform(element.createdAt, 'HH:mm') , status: element.status , old_data: element.old_data , new_data: element.new_data , comments: element.comment })
            }
          }
        })
      }
    }



  }
}
