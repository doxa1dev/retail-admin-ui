
export class Product {
  id: string;
  orderLineId: string;
  entityId: string;
  publicId: string;
  productUri: string;
  isActive: boolean;
  productName: string;
  productDescription: string;
  sku: string;
  listedPrice: string;
  promotionalPrice: string;
  promotionStartTime: string;
  promotionEndTime: string;
  tax: string;
  currencyCode: string;
  hasAdvisor: boolean;
  termsAndConditionsLink: string;
  properties: Properties;
  createdAt: string;
  updatedAt: string;
  language: string;
  quantity: number;
  category: string;
  hasSpecialPayment: boolean;
  shippingFee: string;
  maxOrderNumber: number;
  weight: string;
  images: string[];
  arrCategories: any = [];
  history: any = [];
  cover_photo_key: string;
  need_unbox: boolean;
  need_host: boolean;
  warranty_duration_in_days: number;
  list_serial_number : string[];
  allow_epp_payment: boolean;
  allow_recurring_payment: boolean;
  has_commission: boolean;
  deposit_amount: number;
  plannedPrice: string;
  price: string;
  cart_combination: boolean;

  single_paymt_gifts: any[];
  online_bank_transfer_gifts: any[];

  order_line_single_paymt_gifts: any[];
  order_line_online_bank_transfer_gifts: any[];

  internalDiscountPrice: string;
  naepDiscountPrice: string;
  activeFor: string[] = [];
  internalDiscountFor: string[] = [];
  maxTotalDiscount: number;
  internal_discount_start_time : string;
  is_naep_discount : boolean;
  is_display : boolean;
  is_deposit: boolean;
  is_fee: boolean;
  is_kit: boolean;
  naep_advisor_kit;
  customer_id : number;
  order_id: string;
  advisor_customer: any;
  list_serial_number_shipping : SerialNumberShipping[];

  is_sd_only: boolean;
  is_sd_before: boolean;
  is_sd_after: boolean;
  sd_price : string ;
  is_host_gift: boolean;
  productKit: ProductKit[];
  productGift: ProductGift[] = [];
  arrSku: any[] = [];
  constructor() { }
}

export class Properties {
  id: string;
  name: string;
}

export class ProductKit {
  id: string;
  name: string;
  promotionalPrice: string;
  currencyCode: string;
  sku: string;
  list_serial_number: string[];
  list_serial_number_shipping: SerialNumberShipping[];
  quantity : number;
  warranty_duration_in_days: number;
  orderLineId: string;
  arraySerialNumber = [];
}

export class ProductGift {
  id: string;
  name: string;
  promotionalPrice: string;
  currencyCode: string;
  sku: string;
  quantity : number;
  orderLineId: string;
  is_main_gift: boolean;
  // list_serial_number: string[];
  // list_serial_number_shipping: SerialNumberShipping[];
  // warranty_duration_in_days: number;
  // arraySerialNumber = [];
}

export class SerialNumberShipping{
  id : number;
  value : string;
  display: boolean;
}
