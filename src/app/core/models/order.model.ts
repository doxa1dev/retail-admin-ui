export class orderTable{
  id: string;
  orderIdTmm: string;
  updatedAt: string;
  customer: string;
  status: string;
  advisor: string;
  total: string;
  currency: string;
  shippingMethod: string ='';
  quantity: number = 0 ;
  availability: boolean;
  shippingLocation : Shipping_location;
  shippingDate: string = '';
  constructor(){}
}


export class Shipping_location {
  color: string;
  name : string;
}
