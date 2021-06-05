class Shipping
{
  label: string;
  data: string;
  value: number;
}

export const SHIPPING_METHOD: Array<Shipping> =  [
  {
    label: 'Delivery By Thermomix',
    data: 'BY_THERMOMIX',
    value: 0
  },
  {
    label: 'Delivery By Courier',
    data: 'BY_COURRIER',
    value: 1
  },
  {
    label: 'Self-collect',
    data: 'SELF_COLLECT',
    value: 2
  },
]

export const DELIVERY_TYPE: Array<Shipping> =  [
  {
    label: 'Normal delivery',
    data: 'NORMAL',
    value: 0
  },
  {
    label: 'Specfic date',
    data: 'SD_ONLY',
    value: 1
  },
  {
    label: 'Specific Date & Time',
    data: 'SD_BEFORE_AFTER',
    value: 2
  }
]

export const DELIVERY_BY: Array<Shipping> =  [
  {
    label: 'Self-collect',
    data: 'SELF_COLLECT',
    value: 0
  },
  {
    label: 'By Courier',
    data: 'BY_COURRIER',
    value: 1
  },
  {
    label: 'By Thermomix',
    data: 'BY_THERMOMIX',
    value: 2
  },
  {
    label: 'By Qxpress (before 7pm)',
    data: 'BY_QXPRESS',
    value: 3
  }
];

export class DeliveryShipping {
  shippingId: number;
  orderId: number;
  delivery_type : string;
  delivery_by : string;
  delivery_date : string;
  delivery_time_slot : string;
  sd_id : number;
}

export class CreateQuickOrder {
  shipping_id : number;
  orderId: number;
  customerName: string;
  customerPhone: number;
  customerZipCode: string;
  customerAddressLine1: string;
  customerAddressLine2: string;
  pickUpdate: string;
  pickUpTime: string;
  orderItem: Array<OrderItemsQxpress> = [];;
}

export class OrderItemsQxpress{
  ITEM_NM: string;
  QTY: number;
  PURCHASE_AMT: string;
  CURRENCY: string;
  ITEM_ID : number;
  ITEM_URL: string = "";
  ITEM_IMAGE_URL: string = "";
  REF_ORDER_NO: string = "";
  REMARK: string = "";
}
