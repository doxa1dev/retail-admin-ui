import { Injectable } from '@angular/core';

import { NaepType , NaepProcess , NaepPackage ,
    getNaepTypeDetail, updateNaepType , getNaepProcessDetail,
    updateNaepProcess , GetNaepPackageDetail , NaepAdvisorKit, NaepDepositProduct, HasAdvisorProduct, GetListAdminRole, UpdateAdminRole,
    getUrlImageNaepPackageApi,
    getAdvisoryProductApi,
    createAdvisoryProductApi
} from "./backend-api";
import { ApiService } from './api.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { DataPackageDetail, DataValue, Kit, NaepAdminRole, NaepPackageTable, NaepProcessTable, NaepTypeTable, RenderListSelected } from '../models/naep.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TypeMultiSelectProduct, Value } from './reports.service';
import { AdminRoles } from '../enum/admin-roles.enum';

@Injectable({
  providedIn: 'root'
})
export class NewNaepService {

  constructor(
    private api: ApiService , private http: HttpClient
    ) {}

    httpOption = {
      headers: new HttpHeaders({
        Authorization: "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'application/json'
      })
    }




    // NAEP Type Table----------------------------------
  getListNaepType(): Observable<any> {
    return this.api.get(NaepType).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderNaepTypeTable(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderNaepTypeTable(data){
    let listNaepType = [];
    if(!CheckNullOrUndefinedOrEmpty(data)){
      data.forEach(element => {
        let type = new NaepTypeTable();
        type.id = element.id;
        type.uuid = {uuid: element.uuid, type: 'TYPE'};
        type.naep_type = element.name;
        type.period = element.period_length;
        listNaepType.push(type)
      });
    }
    return listNaepType;
  }

  //NAEP Process Table--------------------------------
  getListNaepProcess(): Observable<any> {
    return this.api.get(NaepProcess).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderNaepProcessTable(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderNaepProcessTable(data){
    let listNaepProcess = [];
    if(!CheckNullOrUndefinedOrEmpty(data)){
      data.forEach(element => {
        let process = new NaepProcessTable();
        process.id = element.id;
        process.uuid = {uuid: element.uuid, type: 'PROCESS'};
        process.naep_process = element.name;
        process.description = element.description;
        listNaepProcess.push(process)
      });
    }
    return listNaepProcess;
  }

  //NAEP Advisor Kit------------------------------
  getNaepAdvisorKit(uuid): Observable<any> {
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(NaepAdvisorKit,{ headers: this.api.headers, params: param }).pipe(
        map(data=>{
          let kit = new Kit();
          if( !CheckNullOrUndefinedOrEmpty(data) && data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)){
            kit.name = data.data.name;
            kit.sku = data.data.sku;
            if(!CheckNullOrUndefinedOrEmpty(data.data.naepAdvisorKitItem)){
              data.data.naepAdvisorKitItem.forEach(element => {
                let selectedProduct = new Value();
                selectedProduct.name = !CheckNullOrUndefined(element.product) ? element.product.product_name : "";
                selectedProduct.id = !CheckNullOrUndefined(element.product) ? element.product.id : null;
                kit.advisorData.push(selectedProduct)
              });
            }
          }
          return kit;
        }), catchError(err => throwError(err))
      )
    }
  }

  //NAEP Package Table--------------------
  getListNaepPackage(): Observable<any> {
    return this.api.get(NaepPackage).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderNaepPackageTable(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  renderNaepPackageTable(data){
    let listNaepPackage = [];
    if(!CheckNullOrUndefinedOrEmpty(data)){
      data.forEach(element => {
        let packages = new NaepPackageTable();
        packages.id = element.id;
        packages.uuid = {uuid: element.uuid, type: 'PACKAGE'};
        packages.naep_package = element.package_name;
        packages.description = element.description;
        packages.is_active = element.is_active;
        listNaepPackage.push(packages)
      });
    }
    return listNaepPackage;
  }

  //Naep Type Function---------------------------------------
  createNaepType(name , period, valueGift){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(name)){
      param = param.append('name', name);
    }
    if(!CheckNullOrUndefined(period)){
      param = param.append('period_length', period);
    }
    if (!CheckNullOrUndefinedOrEmpty(valueGift)) {
      param = param.append('gift_product_id', valueGift)
    }
    if(this.api.isEnable()){
      return this.http.post<any>(NaepType, "" ,{ headers: this.api.headers, params: param })
    }
  }

  updateNaepType(name , period , uuid, valueGift) {
    let param = new HttpParams();
    if(!CheckNullOrUndefined(name)){
      param = param.append('name', name);
    }
    if(!CheckNullOrUndefined(period)){
      param = param.append('period_length', period);
    }
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('naep_type_uuid', uuid);
    }
    if (!CheckNullOrUndefinedOrEmpty(valueGift)) {
      param = param.append('gift_product_id', valueGift)
    }
    if(this.api.isEnable()){
      return this.http.put<any>(updateNaepType, "" ,{ headers: this.api.headers, params: param })
    }
  }

  getNaepTypeDetail(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('naep_type_uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(getNaepTypeDetail, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200){
            // console.log(data.data)
            return data.data
          }
        })
      )
    }
  }

  deleteNaepType(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('naep_type_uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.delete<any>(NaepType,{headers: this.api.headers, params: param})
    }
  }
  //-------------------------------------------------------------------------

  //Naep Process Function---------------------------------------------------
  createNaepProcess(formNaepProcess){
    return this.api.post(NaepProcess , formNaepProcess);
  }

  createAdvisorProduct(advisorProduct){

    return this.api.post(createAdvisoryProductApi , advisorProduct);
    // if(this.api.isEnable()){
    //   return this.http.post<any>(createAdvisoryProductApi, advisorProduct)
    // }
  }

  getNaepProcessDetail(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('naep_process_uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(getNaepProcessDetail, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200){
            return data.data
          }
        })
      )
    }
  }

  deleteNaepProcess(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('naep_process_uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.delete<any>(NaepProcess,{headers: this.api.headers, params: param})
    }
  }

  updateNaepProcess(formUpdateNaepProcess){
    return this.api.post(updateNaepProcess ,formUpdateNaepProcess)
  }
  //-----------------------------------------------------------------------------

  //Naep Packages Function---------------------------------------------------
  getListNaepTypeForPackages(): Observable<any> {
    return this.api.get(NaepType).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderListSelectesNaep(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  getListNaepProcessForPackages(): Observable<any> {
    return this.api.get(NaepProcess).pipe(
      map((value) =>
      {
          if (value.code === 200)
          {
              let result = [];
              result = this.renderListSelectesNaep(value.data)
              return result;
          }
      }), catchError(err => throwError(err))
    );
  }

  createNaepPackages(formNaepPackages){
    return this.api.post(NaepPackage , formNaepPackages);
  }

  getNaepPackageDetail(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.get<any>(GetNaepPackageDetail, { headers: this.api.headers, params: param }).pipe(
        map(data=>{
          if(data.code === 200){
            let result;
            result = this.renderDataPackage(data.data)
            return result
          }
        })
      )
    }
  }

  deleteNaepPackage(uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.delete<any>(NaepPackage,{headers: this.api.headers, params: param})
    }
  }

  updateNaepPackage(formUpdateNaepPackage , uuid){
    let param = new HttpParams();
    if(!CheckNullOrUndefined(uuid)){
      param = param.append('uuid', uuid);
    }
    if(this.api.isEnable()){
      return this.http.put<any>(NaepPackage,formUpdateNaepPackage,{headers: this.api.headers, params: param})
    }
  }

  getAllDepositProduct(){

    return this.api.get(NaepDepositProduct).pipe(
      map(data=>{
        // console.log(data)
        if(data.code === 200){
          let result = [];
          result = this.renderTypeMultiSelectProduct(data.data)
          return result;
        }
      }), catchError(value => throwError(value))
    )
  }

  getAllProductHasAdvisor(){
    return this.api.get(HasAdvisorProduct).pipe(
      map(data=>{
        // console.log(data)
        if(data.code === 200){
          let result = [];
          result = this.renderTypeMultiSelectProduct(data.data)
          return result;
        }
      }), catchError(value => throwError(value))
    )
  }

  getAdvisoryProduct() {
    return this.api.get(getAdvisoryProductApi).pipe(
      map(data=>{
        // console.log(data)
        if(data.code === 200){

          return data.data
        }
      }), catchError(value => throwError(value))
    )
  }
  //------------------------------------------------

  renderTypeMultiSelectProduct(data) {
    let arrProduct = []
    if(!CheckNullOrUndefinedOrEmpty(data)){
      data.forEach(element => {
        let value = new Value()
        let typeMultiSelect = new TypeMultiSelectProduct()
        typeMultiSelect.label = element.product_name
        value.name =  element.product_name
        value.id = element.id
        typeMultiSelect.value = value
        arrProduct.push(typeMultiSelect)
      })
    }
    return arrProduct
  }

  renderDataPackage(data){
    if(!CheckNullOrUndefined(data)){
      let packages = new DataPackageDetail();
      packages.name = data.package_name;
      packages.avatar = data.package_avatar;
      packages.description = data.description;
      packages.history = data.history;
      packages.is_active = data.is_active;
      if(!CheckNullOrUndefinedOrEmpty(data.grace_period_days)){
        packages.has_grace_period = true;
        packages.grace_period_days = data.grace_period_days;
      }else{
        packages.has_grace_period = false;
      }
      if(!CheckNullOrUndefinedOrEmpty(data.naep_type)){
        data.naep_type.forEach(type => {
          let selectedType = new DataValue();
          selectedType.name = !CheckNullOrUndefined(type.type) ? type.type.name : "";
          selectedType.id = Number(type.type_id);
          packages.naep_type.push(selectedType)
        });
      }
      if(!CheckNullOrUndefinedOrEmpty(data.naep_process)){
        let selectedProcess = new TypeMultiSelectProduct ();
        selectedProcess.label = !CheckNullOrUndefined(data.naep_process.process) ? data.naep_process.process.name : "";
        let value = new Value();
        value.name = !CheckNullOrUndefined(data.naep_process.process) ? data.naep_process.process.name : "";
        value.id = Number(data.naep_process.process_id);
        selectedProcess.value = value
        packages.naep_process = selectedProcess;
      }
      if(!CheckNullOrUndefinedOrEmpty(data.naep_item)){
        data.naep_item.forEach(item => {
          let selectedProduct = new Value();
          selectedProduct.name = !CheckNullOrUndefined(item.product) ? item.product.product_name : "";
          selectedProduct.id = item.product_id;

          if (item.is_fee) {
            let fee = new TypeMultiSelectProduct ();
            fee.label = !CheckNullOrUndefined(item.product) ? item.product.product_name : "";
            fee.value = selectedProduct;
            packages.naep_fee = fee;

          } else if (item.is_deposit) {
            packages.naep_deposit_product.push(selectedProduct)

          } else if (item.is_payback) {
            let pacback = new TypeMultiSelectProduct ();
            pacback.label = !CheckNullOrUndefined(item.product) ? item.product.product_name : "";
            pacback.value = selectedProduct;
            packages.naep_paypack = pacback;
          }
        });
      }

      if(!CheckNullOrUndefinedOrEmpty(data.naepPackageKit) && !CheckNullOrUndefinedOrEmpty(data.naepPackageKit.naepAdvisorKit)){
        packages.advisorKit.name = data.naepPackageKit.naepAdvisorKit.name;
        packages.advisorKit.sku = data.naepPackageKit.naepAdvisorKit.sku;
        if(!CheckNullOrUndefinedOrEmpty(data.naepPackageKit.naepAdvisorKit.naepAdvisorKitItem)){
          data.naepPackageKit.naepAdvisorKit.naepAdvisorKitItem.forEach(element => {
            let selectedProduct = new Value();
            selectedProduct.name = !CheckNullOrUndefined(element.product) ? element.product.product_name : "";
            selectedProduct.id = !CheckNullOrUndefined(element.product) ? element.product.id : null;
            packages.kitItem.push(selectedProduct)
          });
        }
      }

      return packages;
    }
  }

  renderListSelectesNaep(data){
    if(!CheckNullOrUndefinedOrEmpty(data)){
      let listNaepType = [];
      data.forEach(element => {
        let type = new RenderListSelected();
        type.label = element.name;
        type.value.id = Number(element.id);
        type.value.name = element.name;
        listNaepType.push(type)
      });
      return listNaepType;
    }
  }

  renderHistory(element) {
    let arrTimeLine = [];
    if (!CheckNullOrUndefinedOrEmpty(element)) {
      element.forEach(data => {
        let timeLine = new TimeLineNaep();
        timeLine.action = "Updated by " + data.appUser.email
        timeLine.createdAt = data.created_at;
        arrTimeLine.push(timeLine);
      });
      return arrTimeLine;
    }
  }

  getListAdminRole(): Observable<any> {
    return this.http.get<any>(GetListAdminRole, {headers: this.api.headers}).pipe(
      map(data => {
        let listData = [];
        data.forEach(element => {
          let item = new NaepAdminRole();
          item.id = element.id;
          item.email = element.email;
          element.user_role.forEach(itemRole => {
            if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_SUPER_ADMIN) {
              item.retail_super_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_ADMIN) {
              item.retail_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.MARKETING_ADMIN) {
              item.marketing_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_WH_ADMIN) {
              item.retail_wh_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_CS_ADMIN) {
              item.retail_cs_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_IT_ADMIN) {
              item.retail_it_admin = true;
            } else if(itemRole.mt_role.name.trim() === AdminRoles.RETAIL_AC_ADMIN) {
              item.retail_ac_admin = true;
            }
          })


          listData.push(item);
        });
        return listData;
      })
    )
  }

  updateAdminRole(param: string) {
    console.log(this.api.headers)
    return this.http.post<any>(UpdateAdminRole, param , this.httpOption).pipe(
      map(data => {
        return data;
      })
    )
  }

  getUrlImageNaepPackage(fileName: string, fileType){
    const bodyObj = { name: fileName, type: fileType };
    return this.api.post(getUrlImageNaepPackageApi, bodyObj);
  }
}


export class TimeLineNaep {
  createdAt: string;
  action: string;
}

