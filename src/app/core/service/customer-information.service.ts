import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {
  getDataCustomers,
  getCustomerInformation,
  updateAdvisor,
  searchAssignAdvisor ,
  EditPhoneCustomer,
  EditEmailCustomer,
  EditNameCustomer,
  ReportCustomerHistoryApi,
  adminVerifyPhoneApi,
  adminVerifyEmailApi,
  editBankInfoApi
} from "./backend-api";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry } from "rxjs/operators";
import { isNullOrUndefined } from "util";
import { formatDate } from "@angular/common";
import { Profile } from "../models/profile.model";
import * as _ from 'lodash';
import { CustomerInformation } from '../models/customer-information.model';
import HelperFn from 'app/main/direct-sales/orders/helper/helper-fn';
import { TimeLine } from './category.service';
import { CheckNullOrUndefinedOrEmpty } from "../utils/common-function";
import { ReportUpdateHistory } from "./convert.service";

@Injectable({
  providedIn: "root",
})
export class CustomerInformationService {

  helperFn = new HelperFn();
  constructor(private api: ApiService, private http: HttpClient) {}

  getAllCustomers(limit,page , params): Observable<any>{
    let param = new HttpParams();
    if (!isNullOrUndefined(page)) {
      param = param.append('page', page);
    }
    if (!isNullOrUndefined(limit)) {
      param = param.append('limit', limit);
    }

    if(!isNullOrUndefined(params.filterModel)){
      if(!isNullOrUndefined(params.filterModel.nameAsInIC)){
        param = param.append('name', params.filterModel.nameAsInIC.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.nickName)){
        param = param.append('nickName', params.filterModel.nickName.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.email)){
        param = param.append('email', params.filterModel.email.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.phoneNumber)){
        param = param.append('phone', params.filterModel.phoneNumber.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.advisorName)){
        param = param.append('adname', params.filterModel.advisorName.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.recruiterId)){
        param = param.append('adid', params.filterModel.recruiterId.filter.trim());
      }
      if(!isNullOrUndefined(params.filterModel.advisorId)){
        param = param.append('advisorId', params.filterModel.advisorId.filter.trim());
      }
    }

    if (this.api.isEnable()) {
      return this.http.get<any>(getDataCustomers, { headers: this.api.headers, params: param }).pipe(
        map (data => {

          let listCustomer = new Array<CustomerInformation>();
          data.data.forEach(element => {

            let customer = new CustomerInformation();
            customer.publicId = element.public_id;
            customer.nameAsInIC = element.firt_name;
            customer.nickName = element.preferred_name;
            customer.email = element.email;
            customer.postal_code = element.postal_code;
            customer.phoneNumber = "(+" + element.phone_dial_code + ") " + element.phone_number;
            customer.hasAccount = element.is_anomynous_account
            if (!isNullOrUndefined(element.address)) {
              customer.country = this.helperFn.setStateCountryLine(element.address.state_code, element.address.country_code);

              customer.address = this.helperFn.setDisplayAddressLine(element.address.address_line1,
                element.address.address_line2, element.address.address_line3, element.address.postal_code) + " " + customer.country;

            } else {
              customer.address = null;
            }

            if (!isNullOrUndefined(element.advisorCustomer)) {
              customer.advisorName = element.advisorCustomer.firt_name;
              customer.recruiterId = element.advisorCustomer.advisor_id_number;
            } else {
              customer.advisorName = null;
              customer.advisorId = null;
            }
            customer.advisorId = element.advisor_id_number || "";
            listCustomer.push(customer)
          });
          return {listCustomer, sum: data.count};
        }), catchError((data) => throwError(data))
      )
    }
  }

  getCustomerByUuid(uuid): Observable<any>{
    let url = getCustomerInformation.replace(":uuid", uuid);

    return this.api.get(url).pipe(
      map(data => {
        if (data.code === 200 && !CheckNullOrUndefinedOrEmpty(data.data)) {

          let customer = new CustomerInformation()
          customer.nameAsInIC = data.data.firt_name;

          if (data.data.preferred_name != "" && !CheckNullOrUndefinedOrEmpty(data.data.preferred_name)) {
            customer.nickName = data.data.preferred_name;
            customer.preferredName = data.data.preferred_name;
          } else {
            customer.nickName = null;
            customer.preferredName = null;
          }

          if (!CheckNullOrUndefinedOrEmpty(data.data.address)) {
            customer.country = this.helperFn.setStateCountryLine(data.data.address.state_code, data.data.address.country_code);

            customer.address = this.helperFn.setDisplayAddressLine(data.data.address.address_line1,
              data.data.address.address_line2, data.data.address.address_line3, data.data.address.postal_code) + " " + customer.country;
          } else {
            customer.address = null;
          }
          customer.phoneDialCode = data.data.phone_dial_code;
          customer.postal_code = data.data.postal_code;
          customer.phoneNumberAndDialCode = "(+" + data.data.phone_dial_code + ") " + data.data.phone_number;
          customer.phoneNumber =  data.data.phone_number;
          customer.phoneNumberTemp = data.data.phone_dial_code + data.data.phone_number;
          customer.phone_dial_code = data.data.phone_dial_code
          customer.email = data.data.email;
          customer.id = data.data.id;
          customer.is_active = data.data.is_active
          customer.is_registered = data.data.is_registered
          //Advisor
          customer.myAdvisorId = data.data.advisor_id_number;

          if (!CheckNullOrUndefinedOrEmpty(data.data.advisorCustomer)) {

            if (!CheckNullOrUndefinedOrEmpty(data.data.advisorCustomer.preferred_name) &&
            data.data.advisorCustomer.preferred_name != "") {
              customer.advisorName = data.data.advisorCustomer.preferred_name;
            } else {
              customer.advisorName = data.data.advisorCustomer.firt_name;
            }

            customer.advisorId = data.data.advisorCustomer.advisor_id_number;
            customer.advisorPhotoKey = data.data.advisorCustomer.profile_photo_key;
          } else {
            customer.advisorId = null;
          }

          //Recruiter
          if (!isNullOrUndefined(data.data.recruiter)) {

            if (!isNullOrUndefined(data.data.recruiter.preferred_name) &&
            data.data.recruiter.preferred_name != "") {
              customer.recruiterName = data.data.recruiter.preferred_name;
            } else {
              customer.recruiterName = data.data.recruiter.firt_name;
            }

            customer.recruiterId = data.data.recruiter.advisor_id_number;
            customer.recruiterPhotoKey = data.data.recruiter.profile_photo_key;
          } else {
            customer.recruiterId = null;
          }

          //Branch Manager
          if (!isNullOrUndefined(data.data.manager_of_Customer)) {

            if (!isNullOrUndefined(data.data.manager_of_Customer.preferred_name) &&
            data.data.manager_of_Customer.preferred_name != "") {
              customer.branchManagerName = data.data.manager_of_Customer.preferred_name;
            } else {
              customer.branchManagerName = data.data.manager_of_Customer.firt_name;
            }

            customer.branchManagerId = data.data.manager_of_Customer.advisor_id_number;
            customer.branchManagerPhotoKey = data.data.manager_of_Customer.profile_photo_key;
          } else {
            customer.branchManagerId = null;
          }

          //Team Leader
          if (!isNullOrUndefined(data.data.teamLeaderCustomer)) {

            if (!isNullOrUndefined(data.data.teamLeaderCustomer.preferred_name) &&
            data.data.teamLeaderCustomer.preferred_name != "") {
              customer.teamLeaderName = data.data.teamLeaderCustomer.preferred_name;
            } else {
              customer.teamLeaderName = data.data.teamLeaderCustomer.firt_name;
            }

            customer.teamLeaderId = data.data.teamLeaderCustomer.advisor_id_number;
            customer.teamLeaderPhotoKey = data.data.teamLeaderCustomer.profile_photo_key;
          } else {
            customer.teamLeaderId = null;
          }

          customer.customerUpdateHistory = this.renderUpdateHistory(data.data.customerUpdateHistory);

          // bank info
          customer.bank_account = data.data ? (data.data.bank_account || "") : "";
          customer.bank_code = data.data ? (data.data.bank_code || "") : "";
          customer.bank_name = data.data ? (data.data.bank_name || "") : "";

          return customer;
        }
      })
    )
  }

  updateAdvisor(uuid, advisorId): Observable<any> {
    let param = new HttpParams();
    if (!isNullOrUndefined(uuid)) {
      param = param.append('uuid', uuid);
    }
    if (!isNullOrUndefined(advisorId)) {
      param = param.append('advisor_id', advisorId);
    }

    if (this.api.isEnable()) {
      return this.http.post<any>(updateAdvisor,{}, { headers: this.api.headers, params: param }).pipe(
        map (data => { return data; })
    )}
  }

  searchAdvisorByAdvisorId(advisorId): Observable<any> {
    if (!isNullOrUndefined(advisorId)) {

      let url = searchAssignAdvisor.replace(":id", advisorId);
      return this.api.get(url).pipe(
        map(data => {

          if (data.code === 200) {
            let advisor = new CustomerInformation();
            if (!isNullOrUndefined(data.advisor_display)) {

              if (!isNullOrUndefined(data.advisor_display.preferred_name) &&
                data.advisor_display.preferred_name != "") {
                advisor.advisorName = data.advisor_display.preferred_name;
              }
              else if (!isNullOrUndefined(data.advisor_display.firt_name) &&
                data.advisor_display.firt_name != "") {
                advisor.advisorName = data.advisor_display.firt_name;
              }
              else {
                advisor.advisorName = " ";
              }

              advisor.advisorId = data.advisor_display.advisor_id;
              advisor.advisorPhotoKey = data.advisor_display.profile_photo_key;

              return advisor;
            }
          }
        }));
      }
  }

    renderUpdateHistory(element)
    {
        let arrTimeLine = [];
        if (!CheckNullOrUndefinedOrEmpty(element))
        {
            element.forEach(data =>
            {
                let timeLine = new TimeLine()
                if (data.is_verify_customer_email == false && data.is_verify_customer_phone == false) {
                  timeLine.action = "Updated by " + data.appUser.first_name + " " + data.appUser.last_name
                }
                else if (data.is_verify_customer_email == false && data.is_verify_customer_phone == true) {
                  timeLine.action = "Phone number " + data.phone_new + " is verified by " + data.appUser.first_name + " " + data.appUser.last_name
                }
                else if (data.is_verify_customer_email == true && data.is_verify_customer_phone == false) {
                  timeLine.action = "Email " + data.email_new + " is verified by " + data.appUser.first_name + " " + data.appUser.last_name
                }
                timeLine.createdAt = data.created_at;
                if (data.is_verify_customer_email == false && data.is_verify_customer_phone == false) {
                  timeLine.old_data = !CheckNullOrUndefinedOrEmpty(data.phone_old) ? data.phone_old :
                                      (!CheckNullOrUndefinedOrEmpty(data.name_old) ? data.name_old :
                                      (!CheckNullOrUndefinedOrEmpty(data.email_old) ? data.email_old : ''))
                  timeLine.new_data = !CheckNullOrUndefinedOrEmpty(data.phone_new) ? data.phone_new :
                                      (!CheckNullOrUndefinedOrEmpty(data.name_new) ? data.name_new :
                                      (!CheckNullOrUndefinedOrEmpty(data.email_new) ? data.email_new : ''));
                  timeLine.status =  !CheckNullOrUndefinedOrEmpty(data.phone_new) ? 'phone' :
                                      (!CheckNullOrUndefinedOrEmpty(data.name_new) ? 'name' :
                                      (!CheckNullOrUndefinedOrEmpty(data.email_new) ? 'email' :''));
                }
                else if (data.is_verify_customer_email == true && data.is_verify_customer_phone == false) {
                  timeLine.old_data = ''
                  timeLine.new_data = data.email_new
                  timeLine.status = 'verify-email'
                }
                else if (data.is_verify_customer_email == false && data.is_verify_customer_phone == true) {
                  timeLine.old_data = ''
                  timeLine.new_data = data.phone_new
                  timeLine.status = 'verify-phone'
                }
                if (data.is_edit_bank === true && !CheckNullOrUndefinedOrEmpty(data.bank)) {
                  const bankCode = data.bank.bank_code;
                  const bankHolder = data.bank.bank_name;
                  const bankAccount = data.bank.bank_account;
                  timeLine.isEditBank = true;
                  if (!CheckNullOrUndefinedOrEmpty(bankCode)) {
                    timeLine.old_data = bankCode.old_value || "";
                    timeLine.new_data = bankCode.new_value || "";
                    timeLine.status = 'bank code';
                  } else if (!CheckNullOrUndefinedOrEmpty(bankHolder)) {
                    timeLine.old_data = bankHolder.old_value || "";
                    timeLine.new_data = bankHolder.new_value || "";
                    timeLine.status = 'bank holder';
                  } else if (!CheckNullOrUndefinedOrEmpty(bankAccount)) {
                    timeLine.old_data = bankAccount.old_value || "";
                    timeLine.new_data = bankAccount.new_value || "";
                    timeLine.status = 'bank account';
                  }
                }
                arrTimeLine.push(timeLine)
            });
        }
        return arrTimeLine;
    }

    //--------------------
    updatePhoneNumber(uuid , phone){
      let param = new HttpParams();
      if (!CheckNullOrUndefinedOrEmpty(uuid)) {
        param = param.append('uuid', uuid);
      }
      if (!CheckNullOrUndefinedOrEmpty(phone)) {
        param = param.append('phone_number', phone);
      }

      if (this.api.isEnable()) {
        return this.http.put<any>(EditPhoneCustomer,'', { headers: this.api.headers, params: param })
      }
    }


    updateNameinIC(uuid , name){
      let param = new HttpParams();
      if (!CheckNullOrUndefinedOrEmpty(uuid)) {
        param = param.append('uuid', uuid);
      }
      if (!CheckNullOrUndefinedOrEmpty(name)) {
        param = param.append('name', name);
      }

      if (this.api.isEnable()) {
        return this.http.put<any>(EditNameCustomer,'', { headers: this.api.headers, params: param })
      }
    }

    updateEmail(uuid , email){
      let param = new HttpParams();
      if (!CheckNullOrUndefinedOrEmpty(uuid)) {
        param = param.append('uuid', uuid);
      }
      if (!CheckNullOrUndefinedOrEmpty(email)) {
        param = param.append('email', email);
      }

      if (this.api.isEnable()) {
        return this.http.put<any>(EditEmailCustomer,'', { headers: this.api.headers, params: param })
      }
    }

    getDataReportCustomerHistory(start , end){
      let param = new HttpParams();
      if (!CheckNullOrUndefinedOrEmpty(start)) {
        param = param.append('start', start);
      }
      if (!CheckNullOrUndefinedOrEmpty(end)) {
        param = param.append('end', end);
      }

      if (this.api.isEnable()) {
        return this.http.get<any>(ReportCustomerHistoryApi, { headers: this.api.headers, params: param })
      }
    }

    renderDataReport(data){
      let fileCSV = [];
      if(!CheckNullOrUndefinedOrEmpty(data)){
        data.forEach(element => {
          let reportUpdateHistory = new ReportUpdateHistory();
          reportUpdateHistory.admin = !CheckNullOrUndefinedOrEmpty(element.appUser) ? element.appUser.email : "" ;
          reportUpdateHistory.date = formatDate(element.created_at,"dd/MM/yyyy hh:mm","en-US");
          reportUpdateHistory.preferred_name = (!CheckNullOrUndefinedOrEmpty(element.customer) && !CheckNullOrUndefinedOrEmpty(element.customer.preferred_name)) ? ('"' + element.customer.preferred_name + '"') : ('"' + element.customer.firt_name + '"') ;
          reportUpdateHistory.old_name = !CheckNullOrUndefinedOrEmpty(element.name_old) ? ('"' +element.name_old + '"') : "" ;
          reportUpdateHistory.new_name = !CheckNullOrUndefinedOrEmpty( element.name_new) ? ('"' + element.name_new + '"' ) : "" ;
          reportUpdateHistory.new_phone = !CheckNullOrUndefinedOrEmpty( element.phone_new) ? ('="' + element.phone_new + '"') : "" ;
          reportUpdateHistory.old_phone = !CheckNullOrUndefinedOrEmpty( element.phone_old) ?  ('="' + element.phone_old + '"') : "" ;
          reportUpdateHistory.new_email = !CheckNullOrUndefinedOrEmpty( element.email_new) ?  element.email_new : "" ;
          reportUpdateHistory.old_email = !CheckNullOrUndefinedOrEmpty( element.email_old) ?  element.email_old : "" ;

          fileCSV.push(reportUpdateHistory);
        });
        return fileCSV;
      }
    }

    verifyEmail(user_id): Observable<any> {
      return this.api.post(adminVerifyEmailApi, user_id);
    }

    verifyPhone(user_id): Observable<any> {
      return this.api.post(adminVerifyPhoneApi, user_id);
    }

    editBankInfo(uuid: string, body): Observable<any> {
      let param = new HttpParams();

      if (uuid) {
        param = param.append('uuid', uuid);
      }

      if (this.api.isEnable()) {
        return this.http.put(editBankInfoApi, body, { headers: this.api.headers, params: param });
      }
    }
}
