import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { OrdersService } from 'app/core/service/orders.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Component({
  selector: 'view-payment-doc',
  templateUrl: './view-payment-doc.component.html',
  styleUrls: ['./view-payment-doc.component.scss'],
})

export class ViewPaymentDocComponent implements OnInit {

  @Output('updateData') sang = new EventEmitter();
  constructor(
    private orderService: OrdersService, private router: Router
  ) {

  }
  gridApi: any;
  active: any;
  params: any;
  id: any;
  photoKeyExist: any = false;
  payment_photo_key: any;
  storageUrl = environment.storageUrl

  agInit(params) {
    this.gridApi = params.api;
    this.params = params;
    this.id = params.data.id;
    this.active = params.value;

    const rowNode = this.gridApi.getRowNode(this.params.node.id);
    this.payment_photo_key = rowNode.data.doc;

    if(this.payment_photo_key != "" && this.payment_photo_key != null){
        // console.log(this.payment_photo_key);
        this.photoKeyExist=true;
    }
  }

  ngOnInit() {

  }

  openUrl(){
    let url;
    if (this.payment_photo_key != "" && this.payment_photo_key != null)
    {
      url = this.storageUrl+this.payment_photo_key;
      window.open(url, "_blank");
    }
  }




}
