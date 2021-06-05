import { TypeMultiSelectProduct, Value } from '../service/reports.service';

export class naepPendingRecruitment
{
    id: number;
    uuid: string;
    advisorName: string;
    email: boolean;
    recruiterName: string;
    recruiterID: number;
    recruitmentStatus: string;
    status2: string;
}

export class naep
{
    id: number;
    uuid: string;
    advisorName: string;
    advisorID: number;
    email: boolean;
    start: string;
    end: string;
    salesStatus: string;
    naepStatus: string;
    completed_at: string;
    package_name: string;
    is_deposit_packet: boolean;
    quick_completed  : string;
    naepType: NaepType[];
    gift : NaepType;
    is_buy_discount : boolean;
    mark_buy_discount : boolean;
    orderId: string;
}

export class naepApprovedAndRejectedRecruitment
{
    id: number;
    uuid: string;
    advisorName: string;
    email: boolean;
    recruiterName: string;
    recruiterID: number;
    recruitmentStatus: string;
    recruitmentDate: string;
    comments: string;
}

export class NAEPAdvisorDetail{
    name: string;
    dob: string;
    email: string;
    phoneNumber: string;
    bankCode: string;
    bankAccount:string;
    bankHolder: string;
    bankHolderIC: string;
    advisorId: string;
    nation : string;
    nationId : string;
    passport : string;
    country : string;
    address1 : string;
    address2 : string;
    address3 : string;
    postalCode: string;
}

export class NAEPRecruiter{
    recruiterCustomerName: string;
    recruiterCustomerId: string;
    updatedAt: string;
    createdAt: string;
    recruiterStatus: string;
    recruiterManagerCustomerName: string;
    recruiterManagerCustomerId: string;
}

export class SaleHistory{
  product_id : string;
  is_naep_product : boolean;
  order_id : string;
  approved_recruitment_id : string;
}

export class NAEPDetailStatus{
  id : number;
  status: string;
  start: string;
  end: string;
  sale_status: Timeline[];
  dateEndNotFormat: Date;
  is_deposite_package : boolean;
  is_refund : boolean;
  balance : number;
  currency_code : string;
  completed_at: string;
  package_name: string;
  complete_sales_number: number;
  naepType: NaepType[];
  gift : NaepType;
  is_buy_discount : boolean;
  mark_buy_discount : boolean;
  payback_product : boolean;
}

export class Timeline{
  title: string;
  time: string;
}

export class SalesHistory {
  id: number;
  productName: string;
  updateAt: string;
  isNaepProduct: boolean;
  salesHistory: Sale[];
}

export class Sale
{
    title : string;
    date  : Date;
}

export class NAEPProduct
{
  isKeyProduct: boolean;
  isNaepProduct: boolean;
  isDiscountProduct: boolean;
  id: number;
  productName: string;
  publicId: string;
}

export class NaepTypeTable{
  id: number;
  naep_type: string;
  period: number;
  uuid: any
}

export class NaepProcessTable{
  id: number;
  naep_process: string;
  description: string;
  uuid: any;
}

export class NaepPackageTable{
  id: number;
  naep_package: string;
  description: string;
  uuid: any;
  is_active: boolean;
}

export class NaepProcessForm{
  name: string;
  number_sale: number;
  description: string;
  list_key_product: number[] = [];
  list_discount_price: ListDiscountPrice[] = [];
}

export class NaepAdvisoryProduct{
products : string[] = []
}

export class UpdateNaepProcessForm{
  uuid: string;
  name: string;
  number_sale: number;
  description: string;
  list_key_product: number[] = [];
  list_discount_price: ListDiscountPrice[] = [];
}

export class RenderListSelected{
  label: string;
  value: DataValue = new DataValue();
}

export class DataValue{
  id: number;
  name: string;
}

export class NaepPackagesCreateForm{
  name: string;
  naep_type: number[] = [];
  naep_process: number;
  naep_fee: number;
  naep_deposit_product: number[]= [];
  advisorKit: Kit;
  description: string;
  is_active: boolean;
  has_grace_period: boolean;
  grace_period_days: number;
  naep_paypack: number;
  package_avatar: string;
}

export class Kit{
  name: string;
  sku: string;
  advisor_kit : number[] = [];
  advisorData: Array<Value> = [];
}

export class DataPackageDetail{
  name: string;
  avatar: string;
  description: string;
  history: any;
  is_active: boolean;
  naep_type: Array<DataValue> = [];
  naep_process: TypeMultiSelectProduct;
  naep_fee: TypeMultiSelectProduct ;
  naep_deposit_product: Array<Value> = [];
  advisorKit: Kit = new Kit();
  kitItem: Array<Value> = [];
  has_grace_period: boolean;
  grace_period_days: number;
  naep_paypack: TypeMultiSelectProduct;
}

export class NaepAdminRole {
  id: number;
  email: string;
  isSelect: boolean;
  list_role_update: string[];
  //ROLES

  retail_super_admin: boolean;
  retail_admin: boolean;
  marketing_admin: boolean;
  retail_wh_admin: boolean;
  retail_cs_admin: boolean;
  retail_it_admin: boolean;
  retail_ac_admin: boolean;

  constructor() {
    this.id = null;
    this.email = "";
    this.isSelect = false;
    this.list_role_update = [];

    this.retail_super_admin = false;
    this.retail_admin = false;
    this.marketing_admin = false;
    this.retail_wh_admin = false;
    this.retail_cs_admin = false;
    this.retail_it_admin = false;
    this.retail_ac_admin = false;
  }
}

export class ListDiscountPrice {
  index_sale: number;
  value: number;
}

export class NaepType {
  id: number;
  name: string;
  periodLength: number;
  isCompleted: boolean;
  checkGift: boolean;
  isGetGift: boolean;
  productId: number;
  saleTypeId: number;
  imageProduct: string;
  nameProduct: string;
  isGetGiftBuy : boolean;
}
