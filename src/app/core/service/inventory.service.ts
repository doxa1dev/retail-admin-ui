import { Injectable } from "@angular/core";
import { createInventory, productInventory, getDiscountProduct, saveproductInventoryImage,
          getInventoryStockCardApi , getInventoryProductApi,
          getInventoryProductByUuidApi, stockCardDetailApi, getInventoryProductLowStockApi,
          getAdminInventoryProduct, deleteWarranty, updateSpecialProduct, getSpecialProduct , getMinStockApi, getDataKeyProduct
        } from './backend-api';
import { ApiService } from "./api.service";
import { catchError, map, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpParams, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { TimeLine } from './product.service';
import { data, type } from 'jquery';


@Injectable({
  providedIn: "root",
})
export class InventoryService {
  constructor(
    private api: ApiService,
    private http: HttpClient
    ) { }

  /** */
  createInventory(formData): Observable<any>{
    return this.api.post(createInventory, formData)
  }

  /** get Product Inventory*/
  getProductInventory(): Observable<any> {
    return this.api.get(productInventory).pipe(
      map((value) => {
        if (value.code === 200) {
          let result = {
            listInventory: this.renderArrayInventoryProduct(value.data),
            listtypeMultiSelect: this.renderTypeMultiSelect(value.data)
          }
          return result
        }
      }), catchError(value => throwError(value))
      );
  }

  //
  getProductDiscount(): Observable<any> {
    return this.api.get(getDiscountProduct).pipe(
      map((value) => {
        if (value.code === 200) {
          let result = this.renderTypeMultiSelectDiscountProduct(value.data);
          return result;
        }
      }), catchError(value => throwError(value))
      );
  }

  getDataKeyProduct(): Observable<any> {
    let listKeyProduct = [];
    return this.api.get(getDataKeyProduct).pipe(
      map (data => {
        if (data.code === 200 && !isNullOrUndefined(data.data)) {
          data.data.forEach(element => {
            let typeMultiSelect = new TypeMultiSelect();
            typeMultiSelect.label = element.product_name;
            typeMultiSelect.value = element.id;

            listKeyProduct.push(typeMultiSelect);
          });

          return listKeyProduct;
        }
      }), catchError(value => throwError(value))
    )
  }

  /** get Min stock*/
  getMinStock(uuid): Observable<any>{
    let param = new HttpParams();
    if(!isNullOrUndefined(uuid)){
      param = param.append('public_id', uuid);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(getMinStockApi, {headers: this.api.headers , params : param}).pipe(
        map(data => {
          if(data.code === 200){
            let minStock = data.data.product_inventory.min_stock
            let name = data.data.product_name
            return {minStock , name}
          }
        }), catchError(value => throwError(value))
      )
    }
  }

  deleteWarranty(orderId): Observable<any>{
    let url = deleteWarranty.replace(':id', orderId)
    return this.api.delete(url)
  }

  getProductInventoryById(id): Observable<any> {
    let url = getAdminInventoryProduct.replace(':id', id);
    return this.api.get(url).pipe(
      map((data)=> {
        if(data.code === 200){
          return data.data.order_items
        }

      }), catchError(data => throwError(data))
    )
  }

  getUrlImage(fileName: string, fileType){
    const bodyObj = { name: fileName, type: fileType };
    return this.api.post(saveproductInventoryImage, bodyObj).pipe(retry(3), catchError(this.errorHandler));
  }

  uploadFiletoS3(url: string, contentType: string, file){
      const headers = new HttpHeaders({ 'Content-Type': contentType });
      return this.http.put<any>(url, file, { headers: headers, reportProgress: true }).pipe(retry(3), catchError(this.errorHandler));
  }

  /** get Inventory stock card*/
  getInventoryStockCard(page , limit): Observable<any> {
    let url = getInventoryStockCardApi.replace(":page",page).replace(":limit",limit)
    return this.api.get(url).pipe(
      map((value) => {
        // console.log(value)
        if (value.code === 200) {
          let result=[];
          result = this.renderAllStockCard(value.data);
          let data = {
            total: value.total,
            content: result
          }
          return data
        }
      }), catchError(value => throwError(value))
      );
  }

  /** get Inventory product*/
  getInventoryProduct(): Observable<any> {
    return this.api.get(getInventoryProductApi).pipe(
      map((value) => {
        if (value.code === 200) {
          // console.log(value)
          let result = [];
          result = this.renderAllInventoryProduct(value.data);
          return result
        }
      }), catchError(value => throwError(value))
      );
  }

  getInventoryProductLowStock(): Observable<any>
  {
    return this.api.get(getInventoryProductLowStockApi).pipe(
      map((value) =>
      {
        if (value.code === 200)
        {
          let result = [];
          result = this.renderAllInventoryProduct(value.data);
          return result
        }
      }), catchError(value => throwError(value))
    );
  }
  /** put min. stock*/
  updateMinStock(updatedminstockForm)   {
    // let params = new HttpParams();
    if(!isNullOrUndefined(updatedminstockForm)){
      return this.api.put(getInventoryProductApi,updatedminstockForm).pipe(map(data=>{
        return data;
      }))
      // params = params.append('minstock', minStock);
      // params = params.append('productid', uuid);
      // if(this.api.isEnable()){
      //   console.log(params)
      //   return this.http.put(getInventoryProductApi,'', {headers:this.api.headers , params: params})
      }
    }


  /** get single Inventory product*/
  getInventoryProductByUuid(uuid): Observable<any> {
    let url = getInventoryProductByUuidApi.replace(":uuid", uuid)
    return this.api.get(url).pipe(
      map((value) => {
        if (value.code === 200) {
          let result=[];
          result = this.renderInventoryProductByUuid(value.data);

            return {result , name: value.name};


        }
      }), catchError(value => throwError(value))
      );
  }

  /**
   * update Special Product
   */
  updateSpecialProduct(formNAEPProuduct){
    if(!isNullOrUndefined(formNAEPProuduct)){
      return this.api.put(updateSpecialProduct,formNAEPProuduct).pipe(
        map( data => {
          if (data.code === 200 && !isNullOrUndefined(data.data)){
            let historyList = new UpdateHistory();
            let dataCode;

            dataCode = data.code;
            historyList.history = this.renderUpdateHistory(data.data)
            return { dataCode, historyList };
          }
      }))
    }
  }

  getSpecialProduct(): Observable<any> {
    return this.api.get(getSpecialProduct).pipe(
      map (data => {
        if (data.code === 200 && !isNullOrUndefined(data.data)){
          let historyList = new UpdateHistory();
          historyList.history = this.renderUpdateHistory(data.data)
          return historyList;
        }
      })
    )
  }

  renderAllStockCard(data){
    let arrStockCard = [];
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let stockCard = new InventoryStockCard();
        stockCard.uuid = element.uuid;
        stockCard.cardNumber = element.stock_card_number;
        stockCard.comment = element.comment;
        if(!isNullOrUndefined(element.inventory_stock_card_item) && element.inventory_stock_card_item.length > 0){
          stockCard.inOut = element.inventory_stock_card_item[0].in_out_type;
        }
        if(!isNullOrUndefined(element.appUser)){
          stockCard.createBy = element.appUser.email;
        }
        stockCard.createdDate = formatDate(element.created_at,"dd/MM/yyyy hh:mm","en-US");
        stockCard.inOutDate = formatDate(element.in_out_date,"dd/MM/yyyy hh:mm","en-US");
        arrStockCard.push(stockCard)
      });
    }
    return arrStockCard;
  }

  renderAllInventoryProduct(data){
    let arrInventory = [];
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let inventory = new InventoryProduct();
        inventory.uuid = element.product.public_id;
        inventory.id = element.id;
        inventory.productName = element.product.product_name;
        inventory.currentStock = Number(element.stock_quantity);
        inventory.latestUpdated = formatDate(element.updated_at,"dd/MM/yyyy hh:mm","en-US");
        inventory.minStock = Number(element.min_stock);
        inventory.isActive = element.product.is_active
        arrInventory.push(inventory)
      });
      return arrInventory;
    }
  }

  renderInventoryProductByUuid(data){
    let arrInventory = [];
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let inventory = new SingleInventoryProduct();
        let arrName = [];
        let arrReturn = [];
        inventory.cardNumber = element.inventory_stock_card.stock_card_number;
        inventory.inOut = element.in_out_type;
        inventory.quantity = Number(element.moving_quantity);
        inventory.inOutDate = formatDate(element.inventory_stock_card.in_out_date,"dd/MM/yyyy hh:mm","en-US");
        inventory.stockBalance = Number(element.balance);
        inventory.comment = element.inventory_stock_card.comment;
        arrName = this.getNameDocument(this.renderDocument(element.inventory_stock_card.inventory_attachment));

        if(!isNullOrUndefined(arrName) && arrName.length > 0 ){
          arrName.forEach(e=>{
            arrReturn.push(e.name)
          })
        }
        inventory.document = arrReturn.toString()
        inventory.createBy = element.inventory_stock_card.appUser.last_name + element.inventory_stock_card.appUser.first_name;
        inventory.createdDate = formatDate(element.inventory_stock_card.created_at,"dd/MM/yyyy hh:mm","en-US");
        arrInventory.push(inventory)
      });

    }
    return arrInventory;
  }


  renderTypeMultiSelect(data) {
    let arrInventory = []
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let typeMultiSelect = new TypeMultiSelect()
        typeMultiSelect.label = element.product_name
        let value = new Value()
        value.id = element.id
        value.name =  element.product_name
        if(!isNullOrUndefined(element.product_inventory)){
          value.currentStock = element.product_inventory.stock_quantity
          value.minStock = element.product_inventory.min_stock
        }
        typeMultiSelect.value = value
        arrInventory.push(typeMultiSelect)
      })
    }
    return arrInventory
  }

  //
  renderTypeMultiSelectDiscountProduct(data) {
    let arrDiscountProduct = []
    let noneObj = new TypeMultiSelectDiscountProduct()
    noneObj.label = "None"
    let valObj = new ValueDiscount()
    valObj.id = -1
    valObj.listed_price = 0
    valObj.naep_price = 0
    noneObj.value = valObj
    arrDiscountProduct.push(noneObj)

    if (!isNullOrUndefined(data) && data.length > 0) {
      data.forEach(element => {
         let typeMultiSelect = new TypeMultiSelectDiscountProduct()
         typeMultiSelect.label = element.product_name
         let value = new ValueDiscount()
         value.id = element.id
         value.listed_price = element.listed_price
         value.naep_price = element.naep_discount_price
         typeMultiSelect.value = value
         arrDiscountProduct.push(typeMultiSelect)
      })
    }
    return arrDiscountProduct
  }

  getNameDocument(data){
    let storageUrl = environment.storageUrl
    let arr = []
    if (!isNullOrUndefined(data) && data.length > 0) {
      data.forEach(element => {
        let subElement = element.doc.substring(element.doc.lastIndexOf('/') + 1, element.doc.length)
        let name = subElement.substring(29, subElement.length)
        arr.push({name: name, value: storageUrl + element.doc })
      });
    }
    // console.log(arr)
    return arr;
  }

  renderArrayInventoryProduct(data){
    let arrInventory: Array<ProductInventory> = []
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let productInventory = new ProductInventory()
        productInventory = this.renderProductInventory(element)
        arrInventory.push(productInventory)
      });
    }
    return arrInventory
  }

  /**
   * renderProductInventory
   * @param data
   */
  renderProductInventory(data){
    if(!isNullOrUndefined(data)){
      let productInventory = new ProductInventory()
      productInventory.id = data.id
      productInventory.publicId = data.public_id
      productInventory.productName = data.product_name
      productInventory.productInventory = this.renderInventory(data.product_inventory)
      return productInventory
    }
  }

  /**
   * renderInventory
   * @param data
   */
  renderInventory(data){
    let arrInventory: Array<Inventory> = []
    if(!isNullOrUndefined(data) && data.length > 0){
      data.forEach(element => {
        let inventory = new Inventory()
        inventory.id = element.id
        inventory.entityId = element.entity_id
        inventory.productId = element.product_id
        inventory.stockQuantity = element.stock_quantity
        inventory.isDeleted = element.is_deleted
        inventory.createdAt = element.created_at
        inventory.updatedAt = element.updated_at
        inventory.minStock = element.min_stock
        arrInventory.push(inventory)
      });
    }
    return arrInventory
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        console.error('An error occured:', error.error.message);
    }
    else {
        console.error(
            `Back-end return code: ${error.status}\n` +
            `Body content: ${error.status}`
        );
    }

    return throwError(error.message || 'Server Error');
}

  getStockCarddetail(uuid: string)
  {
    let url = stockCardDetailApi.replace(':UUID',uuid);
    return this.api.get(url).pipe(
      map((value) =>
      {
        // console.log(value)
        if (value.code === 200)
        {
          let stockCardDetailData = new stockCardDetail();
          stockCardDetailData.stockCardNumber = value.data.stock_card_number;
          stockCardDetailData.time = value.data.created_at;
          stockCardDetailData.comment = value.data.comment;

          if(!isNullOrUndefined(value.data.appUser)){
            stockCardDetailData.create_by = value.data.appUser.email;
          }
          stockCardDetailData.in_out_date = value.data.in_out_date;
          stockCardDetailData.document = this.renderDocument(value.data.inventory_attachment);
          stockCardDetailData.stockCardItem = this.renderItem(value.data.inventory_stock_card_item);
          if(!isNullOrUndefined(value.data.inventory_stock_card_item) && value.data.inventory_stock_card_item.length > 0){
            stockCardDetailData.type = value.data.inventory_stock_card_item[0].in_out_type;
          }
          return stockCardDetailData;
        }
      }), catchError(value => throwError(value))
    )
  }
  renderDocument(data)
  {
    let returnData = [] as any;
    if(!isNullOrUndefined(data) && data.length > 0)
    {
      data.forEach(data =>
      {
        returnData.push({ doc: data.storage_key })
      })
    }
    return returnData;
  }

  renderItem(data)
  {
    let returnData = [] as any;
    if (!isNullOrUndefined(data) && data.length > 0)
    {
      data.forEach((data, index)  =>
      {
        returnData.push({ no:'0'+ (index + 1),
        product: (!isNullOrUndefined(data.product)) ? data.product.product_name : "",
        quantity: data.moving_quantity,
        stockBalance: CurrencyCellRenderer(data.balance)})
      })
    }
    return returnData;
  }

  renderUpdateHistory(element)
  {
      let arrTimeLine = []
      if (!isNullOrUndefined(element) && element.length > 0)
      {
          element.forEach(data =>
          {
              let timeLine = new TimeLine()
              timeLine.action = "Updated by " + data.appUser.first_name + " " + data.appUser.last_name
              timeLine.createdAt = data.created_at
              arrTimeLine.push(timeLine)
          });
          return arrTimeLine
      }
  }
}

function CurrencyCellRenderer(value) {
  let inrFormat = value.toLocaleString('en-US');
  return inrFormat;
}

export class ProductInventory{
  id: number
  publicId: string
  productName: string
  productInventory: Array<Inventory>
}

export class Inventory {
  id: number;
  entityId: number;
  productId: number;
  stockQuantity: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  minStock: number;
}

export class TypeMultiSelectDiscountProduct{
  label: string
  value: ValueDiscount
}

export class ValueDiscount {
  id: number
  listed_price : number
  naep_price : number
}

export class TypeMultiSelect{
  label: string
  value : Value
}

export class Value {
  id: number
  name: string
  currentStock: number
  minStock: number
  quantity: number
}

export class stockCardDetail {
  stockCardNumber: string;
  time : Date;
  type : string;
  in_out_date : Date;
  comment : string;
  create_by: string;
  document : [];
  stockCardItem : [];
}
export class InventoryStockCard{
  uuid: string;
  cardNumber: string;
  inOut: string;
  comment: string;
  inOutDate: string;
  createBy: string;
  createdDate: string;
}

export class InventoryProduct{
  uuid: string;
  id: number;
  productName: string;
  currentStock: number;
  latestUpdated: string;
  minStock: number;
  isActive: boolean;
}

export class SingleInventoryProduct{
  cardNumber: number;
  inOut: string;
  quantity: number;
  stockBalance: number;
  comment: string;
  document: string;
  inOutDate: string;
  createBy: string;
  createdDate: string;
}

export class UpdateHistory {
  history: any = [];
}
