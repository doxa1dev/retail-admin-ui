import { data } from 'jquery';
import { forEach } from 'lodash';
import { Injectable } from "@angular/core";
import {
  getNAEPApi,
  getNAEPApprovedAndRejectedApi,
  getNAEPPendingApi,
  getNAEPByUuid, updateDateNAEP,
  checkIsNAEPProductApi,
  checkRecruitMentApi,
  createSaleHistoryApi,
  specialProductApi,
  getDataNaep,
  GetListNaepMember,
  ExtendNaepEndTime,
  RefundApi,
  UpdateRewardApi,
  UpdatePurchasedApi
} from './backend-api';
import { ApiService } from "./api.service";
import { catchError, ignoreElements, map, retry } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { HttpParams, HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { environment } from 'environments/environment';
import { NAEPAdvisorDetail, NAEPRecruiter, NAEPDetailStatus, naep, naepApprovedAndRejectedRecruitment, naepPendingRecruitment, SalesHistory, NAEPProduct, NaepType } from 'app/core/models/naep.model'
import { element } from 'protractor';
import { SALESLIST, SOLDLIST } from '../constants/naep-constants';
import HelperFn from 'app/main/direct-sales/orders/helper/helper-fn';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from '../utils/common-function';
import { TimeLine } from './category.service';

HelperFn
@Injectable({
  providedIn: "root",
})
export class NAEPService {
  helperFn = new HelperFn();
  constructor(
    private api: ApiService,
    private http: HttpClient
  ) { }

  /** get All NAEP*/
  getAllNAEP(page, limit, params): Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(page)) {
      param = param.append('page', page);
    }
    if (!CheckNullOrUndefinedOrEmpty(limit)) {
      param = param.append('limit', limit);
    }

    if (!CheckNullOrUndefinedOrEmpty(params.filterModel)) {
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.advisorName)) {
        param = param.append('advisor', params.filterModel.advisorName.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.naepStatus)) {
        param = param.append('naep_status', params.filterModel.naepStatus.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.end)) {
        param = param.append('date', params.filterModel.end.filter.trim());
      }

      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.advisorID)) {
        param = param.append('advisor_id_number', params.filterModel.advisorID.filter.trim());
      }

      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.email)) {
        param = param.append('email', params.filterModel.email.filter.trim());
      }

      if (params.filterModel.orderId) {
        param = param.append('order_id', params.filterModel.orderId.filter.trim());
      }

      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.completed_at)) {
        param = param.append('completed_at', params.filterModel.completed_at.filter.trim());
      }

      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.package_name)) {
        param = param.append('package_name', params.filterModel.package_name.filter.trim());
      }

      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.quick_completed)) {
        param = param.append('quick_completed', params.filterModel.quick_completed.filter.trim());
      }
    }
    if (this.api.isEnable()) {
      return this.http.get<any>(GetListNaepMember, { headers: this.api.headers, params: param }).pipe(
        map((value) => {
          if (value.code === 200) {
            let result = [];
            result = this.renderNAEP(value.data);
            let data = {
              totalElements: value.count,
              content: result
            }
            return data
          }
        }), catchError(value => throwError(value))
      )
    }

  }

  /** get All NAEP Pending*/
  getAllNAEPPending(page, limit, params): Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(page)) {
      param = param.append('page', page);
    }
    if (!CheckNullOrUndefinedOrEmpty(page)) {
      param = param.append('limit', limit);
    }
    if (!CheckNullOrUndefinedOrEmpty(params.filterModel)) {
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.advisorName)) {
        param = param.append('advisor', params.filterModel.advisorName.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.recruiterName)) {
        param = param.append('recruiter', params.filterModel.recruiterName.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.recruiterID)) {
        param = param.append('recruiterId', params.filterModel.recruiterID.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.status2)) {
        param = param.append('status2', params.filterModel.status2.filter.trim());
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.email)) {
        param = param.append('email', params.filterModel.email.filter.trim());
      }
    }
    if (this.api.isEnable()) {
      return this.http.get<any>(getNAEPPendingApi, { headers: this.api.headers, params: param }).pipe(
        map((value) => {
          if (value.code === 200) {
            // console.log(value)
            let result = [];
            result = this.renderNAEPPending(value.data);
            let data = {
              totalElements: value.count,
              content: result
            }
            return data
          }
        }), catchError(value => throwError(value))
      )
    }

  }

  /** get All NAEP Approved and Rejected*/
  getAllNAEPApprovedAndRejected(page, limit, params): Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(page)) {
      param = param.append('page', page);
    }
    if (!CheckNullOrUndefinedOrEmpty(limit)) {
      param = param.append('limit', limit);
    }
    if (!CheckNullOrUndefinedOrEmpty(params.filterModel)) {
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.advisorName)) {
        param = param.append('advisor', params.filterModel.advisorName.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.recruiterName)) {
        param = param.append('recruiter', params.filterModel.recruiterName.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.recruiterID)) {
        param = param.append('recruiterId', params.filterModel.recruiterID.filter);
      }
      if (!CheckNullOrUndefinedOrEmpty(params.filterModel.recruitmentStatus)) {
        param = param.append('recruiterStatus', params.filterModel.recruitmentStatus.filter);
      }
    }
    if (this.api.isEnable()) {
      return this.http.get<any>(getNAEPApprovedAndRejectedApi, { headers: this.api.headers, params: param }).pipe(
        map((value) => {
          if (value.code === 200) {
            let result = [];
            result = this.renderNAEPApprovedAndRejected(value.data);
            let data = {
              totalElements: value.count,
              content: result
            }
            return data
          }
        }), catchError(value => throwError(value))
      )
    }

  }

  /**
   * get NAEP by Uuid
   * @param uuid
   */
  getNAEPbyUuid(uuid): Observable<any> {

    let naepCustomerDetail = [];
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(uuid)) {
      param = param.append('uuid', uuid);

      if (this.api.isEnable()) {
        return this.http.get<any>(getNAEPByUuid, { headers: this.api.headers, params: param }).pipe(
          map((value) => {
            if (value.code === 200 && !CheckNullOrUndefinedOrEmpty(value.data)) {

              let naepAdvisor = new NAEPAdvisorDetail()

              naepAdvisor.email = value.data.customer.email;
              naepAdvisor.phoneNumber = "(+" + value.data.customer.phone_dial_code + ") " + value.data.customer.phone_number
              // naepAdvisor.name = !CheckNullOrUndefinedOrEmpty(value.data.customer.preferred_name) ? value.data.customer.preferred_name : value.data.customer.firt_name
              naepAdvisor.name = value.data.customer.firt_name
              naepAdvisor.bankAccount = value.data.customer.bank_account
              naepAdvisor.bankCode = value.data.customer.bank_code
              naepAdvisor.bankHolder = value.data.customer.bank_holder
              naepAdvisor.bankHolderIC = value.data.customer.bank_holder_ic
              naepAdvisor.advisorId = value.data.customer.advisor_id_number
              naepAdvisor.postalCode = !CheckNullOrUndefinedOrEmpty(value.data.customer.address) ? value.data.customer.address.postal_code : '';
              naepAdvisor.dob = CheckNullOrUndefinedOrEmpty(value.data.customer.day_of_birth) ? '' : formatDate(value.data.customer.day_of_birth.substring(0, 10), "dd/MM/yyyy", "en-US");
              naepAdvisor.nation = CheckNullOrUndefinedOrEmpty(value.data.customer.country) ? '' : value.data.customer.country;
              naepAdvisor.nationId = CheckNullOrUndefinedOrEmpty(value.data.customer.national_id) ? '' : value.data.customer.national_id;
              naepAdvisor.passport = CheckNullOrUndefinedOrEmpty(value.data.customer.passport) ? '' : value.data.customer.passport;
              naepAdvisor.address1 = '';
              // naepAdvisor.address2 = '';
              // naepAdvisor.address3 = '';
              if (!CheckNullOrUndefinedOrEmpty(value.data.customer.address)) {
                naepAdvisor.address1 = value.data.customer.address.address_line1;
                // naepAdvisor.address2 = value.data.customer.address.address_line2;
                // naepAdvisor.address3 = value.data.customer.address.address_line3;
                naepAdvisor.country = this.helperFn.setStateCountryLine(value.data.customer.address.state_code, value.data.customer.address.country_code);
                naepAdvisor.address1 = this.helperFn.setDisplayAddressLine(value.data.customer.address.address_line1,
                  value.data.customer.address.address_line2, value.data.customer.address.address_line3, value.data.customer.address.postal_code) + " " + naepAdvisor.country;
              }

              let naepRecruiter = new NAEPRecruiter()

              // if (!CheckNullOrUndefinedOrEmpty(value.data.recruiterCustomer.preferred_name)){
              //   naepRecruiter.recruiterCustomerName = value.data.recruiterCustomer.preferred_name;
              // }
              // else
              if (!CheckNullOrUndefinedOrEmpty(value.data.recruiterCustomer.firt_name)) {
                naepRecruiter.recruiterCustomerName = value.data.recruiterCustomer.firt_name;
              } else {
                naepRecruiter.recruiterCustomerName = "";
              }

              naepRecruiter.recruiterCustomerId = value.data.recruiterCustomer.advisor_id_number;

              // recruiter Manager Customer
              if (!CheckNullOrUndefinedOrEmpty(value.data.teamManagerCustomer)) {
                if (!CheckNullOrUndefinedOrEmpty(value.data.teamManagerCustomer.preferred_name)) {
                  naepRecruiter.recruiterManagerCustomerName = value.data.teamManagerCustomer.preferred_name;
                }
                else if (!CheckNullOrUndefinedOrEmpty(value.data.teamManagerCustomer.firt_name && value.data.teamManagerCustomer.last_name)) {
                  naepRecruiter.recruiterManagerCustomerName = value.data.teamManagerCustomer.firt_name + " " + value.data.teamManagerCustomer.last_name;
                }
                else if (CheckNullOrUndefinedOrEmpty(value.data.teamManagerCustomer.firt_name)) {
                  naepRecruiter.recruiterManagerCustomerName = value.data.teamManagerCustomer.last_name;
                }
                else if (CheckNullOrUndefinedOrEmpty(value.data.teamManagerCustomer.last_name)) {
                  naepRecruiter.recruiterManagerCustomerName = value.data.teamManagerCustomer.firt_name;
                }
                else {
                  naepRecruiter.recruiterManagerCustomerName = " ";
                }
                naepRecruiter.recruiterManagerCustomerId = value.data.teamManagerCustomer.id;
              } else {
                naepRecruiter.recruiterManagerCustomerName = " ";
                naepRecruiter.recruiterManagerCustomerId = " ";
              }

              naepRecruiter.updatedAt = formatDate(value.data.updated_at, "dd/MM/yyyy", "en-US");
              naepRecruiter.createdAt = formatDate(value.data.created_at, "dd/MM/yyyy", "en-US");
              naepRecruiter.recruiterStatus = value.data.status;

              let naepStatus = new NAEPDetailStatus();


              if (!CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess)) {
                naepStatus.id = value.data.naepSalesCustomerProcess.id;
                naepStatus.status = value.data.naepSalesCustomerProcess.status;
                naepStatus.start = formatDate(value.data.naepSalesCustomerProcess.start_time, "dd/MM/yyyy", "en-US");
                naepStatus.end = formatDate(value.data.naepSalesCustomerProcess.end_time, "dd/MM/yyyy", "en-US");
                naepStatus.dateEndNotFormat = value.data.naepSalesCustomerProcess.end_time;
                naepStatus.is_deposite_package = value.data.naepSalesCustomerProcess.is_deposit_packet;
                naepStatus.is_refund = value.data.naepSalesCustomerProcess.is_refund;
                naepStatus.mark_buy_discount = value.data.naepSalesCustomerProcess.mark_by_discount;
                naepStatus.payback_product = value.data.naepSalesCustomerProcess.payback_product_id;
                // naepStatus.complete_sales_number = value.data.naepSalesCustomerProcess.complete_sales_number;
                naepStatus.currency_code = CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess.payback_product) ? null : value.data.naepSalesCustomerProcess.payback_product.currency_code;
                //  naepStatus.completed_at = (value.data.naepSalesCustomerProcess.completed_at === null) ? formatDate(value.data.naepSalesCustomerProcess.completed_at,"dd/MM/yyyy","en-US") : " ";
                if (value.data.naepSalesCustomerProcess.is_deposit_packet === true) {
                  naepStatus.package_name = "Deposit Product - " + (value.data.naepSalesCustomerProcess.package_name != null) ? value.data.naepSalesCustomerProcess.package_name : " ";
                } else if (value.data.naepSalesCustomerProcess.is_deposit_packet === false) {
                  naepStatus.package_name = "Advisor Kit - " + (value.data.naepSalesCustomerProcess.package_name != null) ? value.data.naepSalesCustomerProcess.package_name : " ";
                }

                naepStatus.naepType = [];
                let element = value.data.naepSalesCustomerProcess;

                if (!CheckNullOrUndefinedOrEmpty(element.naep_sale_customer_process_type)) {
                  let naepTypeArrar = [];
                  element.naep_sale_customer_process_type.forEach(type => {
                    let naepType = new NaepType();

                    naepType.id = type.naep_sales_customer_process_id;
                    naepType.name = type.name;
                    naepType.periodLength = Number(type.period_length);
                    naepType.checkGift = CheckNullOrUndefinedOrEmpty(type.gift_product_id) ? false : true;

                    naepType.isCompleted = type.is_completed;
                    if (naepType.checkGift) {
                      naepType.isGetGift = type.is_get_gift;
                      naepType.productId = type.gift_product_id;
                      naepType.saleTypeId = type.id;
                      naepType.isGetGiftBuy = type.is_get_gift_buy;

                    }
                    naepTypeArrar.push(naepType)
                  });
                  naepStatus.naepType = naepTypeArrar

                  let arrayGift = naepStatus.naepType.filter(gift => {
                    return gift.isCompleted == true && gift.productId != null
                  }).sort((a, b) => Number(a.periodLength) - Number(b.periodLength));
                  naepStatus.gift = arrayGift[0]
                }

                naepStatus.is_buy_discount = element.refund_status == "NO" ? false : true;
              }

              //check price refund
              // array.forEach(element => {

              // // });
              // console.log(naepStatus.complete_sales_number);

              if(!CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess))
              {
                const sellNumber = (value.data.naepSalesCustomerProcess.recruitmentSalesHistory.length - 1)
                const complete_sales =  value.data.naepSalesCustomerProcess.complete_sales_number;

                if (!CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess.discount_per_sales)){
                  naepStatus.balance = Number(Object.values(value.data.naepSalesCustomerProcess.discount_per_sales)[sellNumber]) - Number(value.data.naepSalesCustomerProcess.total_deposite);
                }
                if (sellNumber > complete_sales )
                {
                  naepStatus.balance = Number(Object.values(value.data.naepSalesCustomerProcess.discount_per_sales)[complete_sales]) - Number(value.data.naepSalesCustomerProcess.total_deposite) ;
                }
              }

              let salesHistory = new SalesHistory();
              if (!CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess) && !CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess.recruitmentSalesHistory)) {

                let saleHistories = value.data.naepSalesCustomerProcess.recruitmentSalesHistory;
                let index = saleHistories.findIndex(element => element.is_naep_product == true)

                if (index !== -1) {
                  salesHistory.isNaepProduct = true;
                  salesHistory.salesHistory = [];
                  const saleHistoryPaid = saleHistories[index] || null;
                  const orderPaid = saleHistoryPaid ? saleHistoryPaid.order : null;
                  const orderPaidId = orderPaid ? orderPaid.order_id_tmm : "";
                  let lengthOfList = Number(value.data.naepSalesCustomerProcess.complete_sales_number);

                  salesHistory.salesHistory.push({ title: SOLDLIST[0].label + ` (${value.data.naepSalesCustomerProcess.package_name} - #${orderPaidId})`, date: saleHistories[index].updated_at});

                  let listProduct = saleHistories.filter(item => {
                    return item.is_naep_product === false;
                  });

                  listProduct.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

                  for (let i = 1; i <= lengthOfList; i++) {
                    let date;
                    let title: string;
                    if (CheckNullOrUndefinedOrEmpty(listProduct[i - 1])) {
                      date = null;
                      title = this.createNaepSaleListLabel(i);
                    } else {
                      let saleHistorySell = listProduct[i - 1] || null;
                      let orderSell = saleHistorySell ? saleHistorySell.order : null;
                      let orderSellId = orderSell ? orderSell.order_id_tmm : "";
                      date = listProduct[i - 1].updated_at;
                      title = this.createNaepSaleListLabel(i) + ' (' + listProduct[i - 1].product.product_name + ' - ' + '#' + orderSellId + ')';
                    }

                    salesHistory.salesHistory.push({ title: title, date: date });
                  }
                }
                else {
                  salesHistory.isNaepProduct = false;
                }
                // if(!CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess.discount_per_sales) && !CheckNullOrUndefinedOrEmpty(value.data.naepSalesCustomerProcess.total_deposite))
                // {
                //   naepStatus.balance = Number(value.data.naepSalesCustomerProcess.discount_per_sales[`${salesHistory.salesHistory.length  - 1}`]) - Number(value.data.naepSalesCustomerProcess.total_deposite);
                // }

              } else {
                salesHistory.isNaepProduct = false;
              }

              let history = this.renderUpdateHistory(value.data.recruitmentUpdateHistory)

              naepCustomerDetail.push(naepAdvisor, naepRecruiter, naepStatus, salesHistory, history)
            }
            return naepCustomerDetail;
          })
        )
      }
    }

  }

  renderUpdateHistory(element) {
    let arrTimeLine = []
    if (!CheckNullOrUndefinedOrEmpty(element)) {
      element.forEach(e => {
        let timeLine = new TimeLine()
        timeLine.action = "Updated by " + (!CheckNullOrUndefinedOrEmpty(e.appUser) ? e.appUser.email : "");
        timeLine.createdAt = e.created_at;
        timeLine.comment = e.action
        arrTimeLine.push(timeLine)
      });
    }
    return arrTimeLine
  }

  createNaepSaleListLabel(index: number) {
    if (index === 0) {
      return 'Buy NAEP package'
    } else if (index === 1) {
      return 'Sell 1st Thermomix'
    } else if (index === 2) {
      return 'Sell 2nd Thermomix'
    } else if (index === 3) {
      return 'Sell 3rd Thermomix'
    } else {
      return `Sell ${index}th Thermomix`
    }
  }



  updateDateNAEP(date, uuid): Observable<any> {
    let param = new HttpParams();
    if (!CheckNullOrUndefinedOrEmpty(date)) {
      param = param.append('uuid', uuid);
      param = param.append('end_time', date);
      if (this.api.isEnable()) {
        return this.http.put<any>(ExtendNaepEndTime, '', { headers: this.api.headers, params: param }).pipe(
          map(value => {
            return value;
          }), catchError(value => throwError(value))
        )
      }
    }
  }

  getDataNAEP(): Observable<any> {
    let naepProductList = [];
    let param = new HttpParams();
    if (this.api.isEnable()) {
      return this.http.get<any>(getDataNaep, { headers: this.api.headers, params: param }).pipe(
        map(value => {
          if (value.code === 200 && !isNullOrUndefined(value.data)) {
            value.data.forEach(element => {
              let naepItem = new NAEPProduct();
              naepItem.isKeyProduct = element.is_key_product;
              naepItem.isNaepProduct = element.is_naep_product;
              naepItem.isDiscountProduct = element.is_naep_discount_product;
              if (!CheckNullOrUndefinedOrEmpty(element.product)) {
                naepItem.id = element.product.id;
                naepItem.productName = element.product.product_name;
                naepItem.publicId = element.product.public_id;
                naepProductList.push(naepItem);
              }
            });
          }
          return naepProductList;
        }), catchError(value => throwError(value))
      )
    }
  }

  renderNAEP(data) {
    let naepARR = [];
    if (!CheckNullOrUndefinedOrEmpty(data)) {
      data.forEach(element => {
        let helperFn = new HelperFn();
        let naepItem = new naep();
        let salesStatusLength = element.recruitmentSalesHistory.length;
        naepItem.uuid = element.recruitment.uuid;
        naepItem.id = element.id;
        //   naepItem.advisorName = !helperFn.isEmptyOrNullOrUndefined(element.recruitment.customer.preferred_name) ? element.recruitment.customer.preferred_name : element.recruitment.customer.firt_name;
        naepItem.advisorName = element.recruitment.customer.firt_name;
        naepItem.advisorID = Number(element.recruitment.customer.advisor_id_number)
        naepItem.email = element.recruitment.customer.email;
        naepItem.start = formatDate(element.start_time, "dd/MM/yyyy", "en-US");
        naepItem.end = formatDate(element.end_time, "dd/MM/yyyy", "en-US");

        if (salesStatusLength == 0) {
          naepItem.salesStatus = ' ';
        } else if (salesStatusLength == 1) {
          naepItem.salesStatus = 'Paid NAEP fee';
        } else if (salesStatusLength == 2) {
          naepItem.salesStatus = 'Sold 1st product';
        } else if (salesStatusLength == 3) {
          naepItem.salesStatus = 'Sold 2nd product';
        } else if (salesStatusLength == 4) {
          naepItem.salesStatus = 'Sold 3rd product';
        } else {
          naepItem.salesStatus = 'Sold ' + (Number(salesStatusLength) - 1) + 'th product';
        }
        naepItem.naepStatus = element.status;
        naepItem.completed_at = (element.completed_at != null) ? formatDate(element.completed_at, "dd/MM/yyyy", "en-US") : "";
        if (element.is_deposit_packet === true) {
          naepItem.package_name = "Deposit Product - " + [!CheckNullOrUndefinedOrEmpty(element.package_name) ? element.package_name : " "];
        } else if (element.is_deposit_packet === false) {
          naepItem.package_name = "Advisor Kit - " + [!CheckNullOrUndefinedOrEmpty(element.package_name) ? element.package_name : " "];
        }
        naepItem.quick_completed = "";
        naepItem.naepType = [];
        naepItem.is_buy_discount = element.refund_status == "NO" ? false : true;
        naepItem.mark_buy_discount = element.mark_by_discount

        if (!CheckNullOrUndefinedOrEmpty(element.naep_sale_customer_process_type)) {
          let naepTypeArrar = [];
          element.naep_sale_customer_process_type.forEach(type => {
            let naepType = new NaepType();

            naepType.id = type.naep_sales_customer_process_id;
            naepType.name = type.name;
            naepType.periodLength = Number(type.period_length);
            naepType.checkGift = CheckNullOrUndefinedOrEmpty(type.gift_product_id) ? false : true;

            naepType.isCompleted = type.is_completed;
            if (naepType.checkGift) {
              naepType.isGetGift = type.is_get_gift;
              naepType.productId = type.gift_product_id;
              naepType.saleTypeId = type.id;
              naepType.isGetGiftBuy = type.is_get_gift_buy;

            }
            naepTypeArrar.push(naepType)
          });
          naepItem.naepType = naepTypeArrar

          let arrayGift = naepItem.naepType.filter(gift => {
            return gift.isCompleted == true && gift.productId != null
          }).sort((a, b) => Number(a.periodLength) - Number(b.periodLength));
          naepItem.gift = arrayGift[0];
          if (!CheckNullOrUndefinedOrEmpty(naepItem.gift)) {
            if (naepItem.gift && (naepItem.gift.isGetGift || naepItem.gift.isGetGiftBuy)) {
              naepItem.quick_completed = "Rewarded";
            } else {
              naepItem.quick_completed = "Pending Rewarded";
            }
          } else {
            naepItem.quick_completed = "";
          }
        }


        if (naepItem.naepStatus === "COMPLETED") {
          if (element.is_deposit_packet === true) {
            let totalsale = Math.min(element.complete_sales_number, Number(salesStatusLength) - 1)
            let balance = (!CheckNullOrUndefinedOrEmpty(element.discount_per_sales))
              ? Number(element.discount_per_sales[totalsale]) - Number(element.total_deposite) : null
            //console.log(balance)
            if (balance <= 0) {
              naepItem.naepStatus = element.status + [element.is_refund == true ? ' - Admin Paid' : ' - Admin Pending Pay']
            } else if (balance > 0) {
              naepItem.naepStatus = element.status + [element.is_refund == true ? ' - Candidate Refunded' : ' - Candidate Pending Refund']
            } else {
              naepItem.naepStatus = element.status + ' - Data Not Tranfer'
            }
          }
          else if (element.is_deposit_packet === false) {
            if (naepItem.is_buy_discount || naepItem.mark_buy_discount) {
              naepItem.naepStatus = element.status + ' - Candidate purchased'
            } else {
              naepItem.naepStatus = element.status + ' - Candidate pending purchased'
            }
          }
        }

        const recruitmentSalesHistory = element.recruitmentSalesHistory || [];
        if (recruitmentSalesHistory.length) {
          const recruitmentSales = recruitmentSalesHistory[0];
          const order = recruitmentSales.order || null;
          naepItem.orderId = order ? (`#${order.order_id_tmm}` || "") : "";
        }

        naepARR.push(naepItem)
      });
      return naepARR;
    }
    return [];

  }

  renderNAEPPending(data) {
    let helperFn = new HelperFn();
    let naepPendingArr = [];
    if (!CheckNullOrUndefinedOrEmpty(data)) {
      data.forEach(element => {
        let pendingNAEP = new naepPendingRecruitment()
        pendingNAEP.uuid = element.uuid;
        pendingNAEP.id = element.id;
        //  pendingNAEP.advisorName =     !helperFn.isEmptyOrNullOrUndefined(element.customer.preferred_name) ? element.customer.preferred_name : element.customer.firt_name ;
        pendingNAEP.advisorName = element.customer.firt_name;
        pendingNAEP.email = element.customer.email;
        // pendingNAEP.recruiterName =   !helperFn.isEmptyOrNullOrUndefined(element.recruiterCustomer.preferred_name) ? element.recruiterCustomer.preferred_name : element.recruiterCustomer.firt_name ;
        pendingNAEP.recruiterName = !helperFn.isEmptyOrNullOrUndefined(element.recruiterCustomer.firt_name) ? element.recruiterCustomer.firt_name : "";
        pendingNAEP.recruiterID = Number(element.recruiterCustomer.advisor_id_number);
        pendingNAEP.recruitmentStatus = 'Pending from Team Leader'
        pendingNAEP.status2 = element.status
        naepPendingArr.push(pendingNAEP)
      });
      return naepPendingArr;
    } else {
      return naepPendingArr = [];
    }
  }

  renderNAEPApprovedAndRejected(data) {
    let arrNAEPApprovedAndRejected = [];
    if (!CheckNullOrUndefinedOrEmpty(data) && data.length > 0) {
      data.forEach(element => {
        let naepItem = new naepApprovedAndRejectedRecruitment()
        naepItem.uuid = element.uuid;
        naepItem.id = element.id;
        naepItem.advisorName = !CheckNullOrUndefinedOrEmpty(element.customer.preferred_name) ? element.customer.preferred_name : element.customer.firt_name;
        naepItem.email = element.customer.email;
        naepItem.recruiterName = !CheckNullOrUndefinedOrEmpty(element.recruiterCustomer.preferred_name) ? element.recruiterCustomer.preferred_name : element.recruiterCustomer.firt_name;
        naepItem.recruiterID = Number(element.recruiterCustomer.id);
        naepItem.recruitmentStatus = element.status;
        naepItem.recruitmentDate = formatDate(element.updated_at, "dd/MM/yyyy", "en-US");
        naepItem.comments = element.comment
        arrNAEPApprovedAndRejected.push(naepItem)
      });
    }
    return arrNAEPApprovedAndRejected;
  }

  checkIsNAEPProduct() {
    return this.api.get(checkIsNAEPProductApi).pipe(map((data) => {
      if (data.code === 200) {
        let listproduct = []
        data.data.forEach(product => {
          if (product.is_naep_product === true) {
            listproduct.push(product.product.id)
          }
        })
        data.data.forEach(product => {
          if (product.is_naep_discount_product === true) {
            listproduct.push(product.product.id)
          }
        })
        return listproduct;
      } else {
        return []
      }
    }))
  };
  checkRecruit(id: string) {
    let param = new HttpParams();
    param = param.append('customer_id', id);
    if (this.api.isEnable()) {
      return this.http.get<any>(checkRecruitMentApi, { headers: this.api.headers, params: param }).pipe(map((data) => {
        if (data.code === 200) {
          return { isValid: true, id: data.data.id, recruitmentId: CheckNullOrUndefinedOrEmpty(data.data.recruitmentApproval) ? null : data.data.recruitmentApproval.id }
        }
        else {
          return { isValid: false, id: null, recruitmentId: null }
        }
      }))
    }
  }

  createSalesHistory(salesHistoryForm) {
    return this.api.post(createSaleHistoryApi, salesHistoryForm);
  }

  getKeyProduct() {
    return this.api.get(specialProductApi).pipe(map((data) => {
      if (data.code === 200) {
        let listKeyProduct = [];
        data.data.forEach(element => {
          listKeyProduct.push(element.product_id);
        })
        return listKeyProduct;
      }
    }))
  }


  markAsRefund(id) {
    let param = new HttpParams();
    param = param.append('id', id);
    if (this.api.isEnable()) {
      return this.http.put<any>(RefundApi, '', { headers: this.api.headers, params: param }).pipe(map(
        (data) => {
          return data;
        }, catchError(value => throwError(value))
      ))
    }
  }

  markAsPurchase(id) {
    let param = new HttpParams();
    param = param.append('naep_process_id', id);
    if (this.api.isEnable()) {
      return this.http.put<any>(UpdatePurchasedApi, '', { headers: this.api.headers, params: param }).pipe(map(
        (data) => {
          return data;
        }, catchError(value => throwError(value))
      ))
    }
  }

  markAsReward(naep_process_id: string) {
    let param = new HttpParams();
    param = param.append('naep_process_id', naep_process_id);
    if (this.api.isEnable()) {
      return this.http.post<any>(UpdateRewardApi, '', { headers: this.api.headers, params: param }).pipe(map(
        (data) => {
          return data;
        }, catchError(value => throwError(value))
      ))
    }
  }
}



