import { Component, OnInit, Input } from '@angular/core';
import { OrdersService, DeliveryAddress } from 'app/core/service/orders.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.scss']
})
export class DeliveryAddressComponent implements OnInit {

  @Input() deliveryAddress : Array<DeliveryAddress>;
  customerInfo: CustomerInfo;
  order_id;
  constructor(
    private _orderService :OrdersService,
    private router: Router, private _route: ActivatedRoute,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {

    // console.log(this.deliveryAddress)
    // this._route.queryParams.subscribe(params=>{
    //   var id = params.id;
    //   this.order_id = id.replace("#",'')
    // })

    // var id = history.state.data;
    // this.order_id = id.id.replace("#",'')
    // this._orderService.getDeliveryAddressByOrderId(this.order_id).subscribe(data=>{
    // this.customerInfo.mail = this.deliveryAddress.
      // this.customerInfo.phone = '('+ this.deliveryAddress.phoneDialCode + ') ' + data.phoneNumber ;
      // this.customerInfo.adress = data.unitNumber + " " + data.detailAddress+ ", " + data.cityState+ ", " + data.countryCode + " " + data.postalCode ;
      // this.customerInfo.name = data.firstName +  ' ' + data.lastName;
    // })
    // this.customerInfo = new CustomerInfo();
    // this.customerInfo.mail = 'cecilia.chen@gmail.com';
    // this.customerInfo.phone = '(+65) 837193';
    // this.customerInfo.adress = '126 North Bridge Road, #11-02, Singapore 628300';
    // this.customerInfo.name = 'CECILIA CHEN';
  }

}
export class CustomerInfo {
  id: string;
  name: string;
  adress: string;
  phone: string;
  mail: string;
}
