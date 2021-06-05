import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isNullOrUndefined } from 'util';
import { formatDate } from '@angular/common';
import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';


@Component({
  selector: 'app-qxpress',
  templateUrl: './qxpress.component.html',
  styleUrls: ['./qxpress.component.scss']
})
export class QxpressComponent implements OnChanges {

  name = 'Angular Html To Pdf ';
  constructor(){}
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;

  @Input() dataCustomer : any ;
  @Input() deliveryAddress : any;
  @Input() trackingData : any;
  @Input() dataProduct : any;
  @Input() is_naep_order: boolean;

  //----QXpress bar code information------------
  value = "SG013333";
  elementType = "svg";
  format = "CODE128";
  lineColor = "black";
  width = 2;
  height = 80;
  textAlign = "center";
  textPosition = "bottom";
  textMargin = 2;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  fontSize = 14;
  background = "#ffffff"
  margin = 10;
  marginTop = 10;
  marginBottom = 10;
  marginLeft = 10;
  marginRight = 10
  //------------------------------------------
  dataTest: DataShippingLabel = new DataShippingLabel();

  tracking = []
  totalQuantity: number = 0 ;

  ngOnChanges(changes: SimpleChanges): void{
    if(!CheckNullOrUndefinedOrEmpty(changes.dataCustomer)){
      this.dataCustomer = changes.dataCustomer.currentValue
    }
    if(!CheckNullOrUndefinedOrEmpty(changes.deliveryAddress)){
      this.deliveryAddress = changes.deliveryAddress.currentValue
    }
    if(!CheckNullOrUndefinedOrEmpty(changes.trackingData)){
      this.trackingData = changes.trackingData.currentValue
    }
    if(!CheckNullOrUndefinedOrEmpty(changes.dataProduct)){
      this.dataProduct = changes.dataProduct.currentValue
    }

    this.dataTest = {
      consignee: this.dataCustomer.firstName,
      telConsignee:  this.deliveryAddress.phoneNumber,
      addressConsignee: this.deliveryAddress.addressLine1 + " " + this.deliveryAddress.addressLine2+ " " + this.deliveryAddress.addressLine3 ,
      shipper: "Thermomix Singapore",
      telShipper: "+65 6634 2016",
      addressShipper: "67 Ubi Avenue 1 #01‐03 Starhub Green Singapore 408942.",
      postalCode: this.deliveryAddress.postalCode,
      areaCode: "B555",
      destination: "SG",
      registeredDate: "10-Jul-2020",
      departure: "SG",
      memo: "",
      itemDescription: "",
      quantity: 1
    }
    // console.log(this.trackingData)
    // console.log(this.dataProduct)
    if(!CheckNullOrUndefinedOrEmpty(this.trackingData) && !CheckNullOrUndefinedOrEmpty(this.trackingData.shippingStatuses)){
      this.trackingData.shippingStatuses.forEach(element => {
        this.totalQuantity = 0;
        let trackingElement = new TrackingDataArray()
        trackingElement.trackingId = element.trackingID;
        trackingElement.trackingIdValues = this.valuesChange(element.trackingID);
        trackingElement.areaCode = element.AreaCode
        if(!CheckNullOrUndefinedOrEmpty(element.productIdAndQty)){
          element.productIdAndQty.forEach(e => {
            trackingElement.total += e.quantity
            this.totalQuantity += e.quantity;
            let product = new DetailProduct()
            product.quantity = e.quantity;
            if(!CheckNullOrUndefinedOrEmpty(this.dataProduct)){
              if(!this.is_naep_order){
                this.dataProduct.forEach(item=>{
                  if(item.id === e.productId){
                    product.productName = item.productName;
                    let stringProperties = JSON.stringify(item.properties);
                    stringProperties = stringProperties.split('"').join(" ").replace("{","").replace("}","");
                    product.properties = stringProperties;
                  }else if(item.order_line_single_paymt_gifts.length > 0
                    ){
                      let single_paymt_gifts = item.order_line_single_paymt_gifts.find(gifts => {
                        return gifts.single_paymt_gift_product_id === e.productId
                      });
                      if(single_paymt_gifts){
                        product.productName = single_paymt_gifts.single_paymt_gift_product_name;
                        product.properties = "";
                      }
                  }
                  else if(item.order_line_online_bank_transfer_gifts.length > 0
                    ){
                      let bank_transfer_gifts = item.order_line_online_bank_transfer_gifts.find(gifts => {
                        return gifts.online_bank_transfer_gift_product_id === e.productId
                      });
                      if(bank_transfer_gifts){
                        product.productName = bank_transfer_gifts.online_bank_transfer_gift_product_name;
                        product.properties = "";
                      }
                  }
                })

              }else{
                this.dataProduct.forEach(item=>{
                  if(item.is_kit || item.is_deposit ){
                    if(item.id === e.productId){
                      product.productName = item.productName;
                      let stringProperties = JSON.stringify(item.properties);
                      stringProperties = stringProperties.split('"').join(" ").replace("{","").replace("}","");
                      product.properties = stringProperties;
                    }
                  }
                })
              }
            }
            trackingElement.detailProduct.push(product)
          });
        }
        if(!CheckNullOrUndefinedOrEmpty(element.registeredDate)){
          trackingElement.registeredDate = formatDate(element.registeredDate, "dd-MMM-yyyy", "en-US")
        }
        this.tracking.push(trackingElement)
      });
    }

  }
  get values(): string[] {
    return this.value.split('\n');
  }
  // getBase64Image(img) {
  //   var canvas = document.createElement("canvas");
  //   console.log("image");
  //   canvas.width = img.width;
  //   canvas.height = img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/png");
  //   return dataURL;
  // }


  valuesChange(data){
    return data.split('\n');
  }

}

export class DataShippingLabel {
  consignee: string;
  telConsignee: string;
  addressConsignee: string;
  shipper: string;
  telShipper: string;
  addressShipper: string;
  postalCode: string;
  areaCode: string;
  destination: string;
  registeredDate: string;
  departure: string;
  memo: string;
  itemDescription: string;
  quantity: number;

}

export class TrackingDataArray{
  trackingId: string;
  total: number = 0;
  trackingIdValues = [];
  areaCode: string;
  registeredDate : string;
  detailProduct: Array<DetailProduct> =[];
}

export class DetailProduct{
  quantity: number = 0;
  productName: string;
  properties: any;
}
