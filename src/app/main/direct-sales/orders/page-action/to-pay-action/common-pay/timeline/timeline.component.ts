import { Component, OnInit , ViewEncapsulation, Input, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { OrderHistories, OrderHistory } from 'app/core/service/orders.service'
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { environment } from 'environments/environment';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.Emulated
})
export class TimelineComponent implements OnChanges {

  storageUrl = environment.storageUrl;
  constructor(
    private datePipe : DatePipe
  ) { }
  @Input() histories: Array<OrderHistory>;
  newhistories;

  @Input() customerName: string;
  // actionFormat: string;
  // type: string;
  // method: string;
  // paymentRef: string;

  ngOnChanges(changes: SimpleChanges) : void{
    // if (changes.histories !== null && changes.histories !== undefined){
    //   this.histories = changes.histories.currentValue;
    //   console.log("change:", this.histories)
    // }

    if(this.histories.length != changes.histories.currentValue.length){
      this.histories = changes.histories.currentValue
    }
    if(isNullOrUndefined(this.histories) === false)
    {
      // console.log(this.histories)
      if (this.histories.length > 0)
      {
        this.newhistories = [];
        this.histories.forEach(element =>
        {
          let actionFormat;
          let type;
          let method;
          let paymentRef;
          let checkChangePayment: boolean = false;
          if(element.action.indexOf('Type:') != -1 && element.action.indexOf('Method:') != -1 && element.action.indexOf('Payment ref:') != -1){
            checkChangePayment = true;
            let arrStringAction = element.action.split('Type:')
            actionFormat = `${arrStringAction[0].trim()}`;
            let arrStringType = arrStringAction[1].split(' ')
            type = arrStringType[0];
            let arrStringMethod =element.action.split('Method:')
            method = arrStringMethod[1].split(' ')[1];
            // console.log('arrStringMethod', this.method)
            let arrStringPaymentRef = element.action.split('Payment ref:')
            paymentRef = arrStringPaymentRef[1].split(' ')[1];
          }
          if (this.newhistories.length === 0)
          {
            this.newhistories.push({ date: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'),
            value: [{
              action: !CheckNullOrUndefinedOrEmpty(actionFormat) ? actionFormat : element.action, time: this.datePipe.transform(element.createdAt, 'HH:mm'),
              appUser: element.email, comment: element.comment,
              comment_receive: element.comment_receive,
              image : element.image,
              hrefImage: this.storageUrl + element.image,
              shipping_methood : element.shipping_method,
              shippng_note : element.shipping_note,
              type: !CheckNullOrUndefinedOrEmpty(type) ? type : '',
              method: !CheckNullOrUndefinedOrEmpty(method) ? method : '',
              paymentRef: !CheckNullOrUndefinedOrEmpty(paymentRef) ? paymentRef : '',
              checkChangePayment: checkChangePayment
            }] })
          }
          else
          {
            let index = this.newhistories.findIndex(e => e.date == this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'))
            if (index === -1)
            {
              this.newhistories.push({ date: this.datePipe.transform(element.createdAt, 'dd/MM/yyyy'),
              value: [{ action: !CheckNullOrUndefinedOrEmpty(actionFormat) ? actionFormat : element.action, time: this.datePipe.transform(element.createdAt, 'HH:mm'),
              appUser: element.email , comment: element.comment , comment_receive: element.comment_receive ,
              image : element.image, hrefImage: this.storageUrl + element.image,shipping_methood : element.shipping_method,
              shippng_note : element.shipping_note ,
              type: !CheckNullOrUndefinedOrEmpty(type) ? type : '',
              method: !CheckNullOrUndefinedOrEmpty(method) ? method : '',
              paymentRef: !CheckNullOrUndefinedOrEmpty(paymentRef) ? paymentRef : '',
              checkChangePayment: checkChangePayment
            }] })
            }
            else
            {
              this.newhistories[index].value.push({ action: !CheckNullOrUndefinedOrEmpty(actionFormat) ? actionFormat : element.action,
                time: this.datePipe.transform(element.createdAt, 'HH:mm'),
                appUser: element.email , comment: element.comment ,
                comment_receive: element.comment_receive , image : element.image,
                hrefImage: this.storageUrl + element.image,shipping_methood : element.shipping_method,
                shippng_note : element.shipping_note ,
                type: !CheckNullOrUndefinedOrEmpty(type) ? type : '',
                method: !CheckNullOrUndefinedOrEmpty(method) ? method : '',
                paymentRef: !CheckNullOrUndefinedOrEmpty(paymentRef) ? paymentRef : '',
                checkChangePayment: checkChangePayment
              })
            }
          }
        })
      }
    }

    // console.log("++++", this.newhistories)
  }
}
