import { Injectable } from "@angular/core";
import { requeryPaymentStatusApi, getRecurringPaymentsByStatus, countRecurringPayments, terminateRecurringPaymentByIdApi } from './backend-api';
import { ApiService } from "./api.service";
import { HttpClient } from '@angular/common/http';
import { RequeryPaymentStatus } from '../models/requery-payment-status.model';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { formatCurrency, formatDate } from '@angular/common';
import { isNullOrUndefined } from 'util';
import { OrderRecurringPaymentTable } from '../models/order-recurring-payment.model';
import { OrdersService, AdvisorCustomer } from './orders.service';


@Injectable({
  providedIn: "root",
})
export class PaymentService {
  constructor(
    private api: ApiService,
    private http: HttpClient, 
    private orderService: OrdersService
  ) { }

  requeryPaymentStatus(requeryPaymentStatus: RequeryPaymentStatus) {
    return this.api.post(requeryPaymentStatusApi, requeryPaymentStatus);
  }


  getAllRecurringPaymentsList(status, page, limit): Observable<any> {
    let url = getRecurringPaymentsByStatus.replace("pages", page);
    let url2 = url.replace("newStatus", status);
    let url3 = url2.replace("limited", limit);
    return this.api.get(url3).pipe(
      map((data) => {
        // console.log(data)
        let listRecurringPayments = new Array<OrderRecurringPaymentTable>();
        data.data.payment_installments.forEach((payment_installment) => {
          let orderRecurringPayment  = new OrderRecurringPaymentTable();

          // this.orderService.getOrderbyOrderId(payment_installment.order_id).subscribe(response => {

          //   if (response.code === 200 && !isNullOrUndefined(response.data)){
          //     orderRecurringPayment.customer = response.data.customer_information.first_name + " " + response.data.customer_information.last_name;
          //     if (isNullOrUndefined(response.data.advisor_customer)) {
          //       orderRecurringPayment.advisor = " ";
          //     } else if (isNullOrUndefined(response.data.advisor_customer.preferred_name)) {
          //       orderRecurringPayment.advisor = response.data.advisor_customer.first_name;
          //     } else {
          //       orderRecurringPayment.advisor = response.data.advisor_customer.preferred_name;
          //     }
          //   }

          // });

          orderRecurringPayment.order_id = payment_installment.order_id;
          const order = payment_installment.order;
          orderRecurringPayment.id_tmm = order.order_id_tmm ? order.order_id_tmm : "";
          orderRecurringPayment.id_tmm = orderRecurringPayment.id_tmm === "" ? payment_installment.order_id : orderRecurringPayment.id_tmm;
          orderRecurringPayment.installment_id = payment_installment.id; 
          orderRecurringPayment.startDate = formatDate(payment_installment.created_at, "dd/MM/yyyy HH:mm", "en-US");
          orderRecurringPayment.updatedAt = formatDate(payment_installment.updated_at, "dd/MM/yyyy HH:mm", "en-US");
          orderRecurringPayment.status = payment_installment.installment_status; 
          orderRecurringPayment.total = payment_installment.installment_amount; 
          let successful_payment_times = !payment_installment.successful_number_of_payments?0: payment_installment.successful_number_of_payments
          orderRecurringPayment.installment_process = String(successful_payment_times)+'/'+String(payment_installment.number_of_payments);
          orderRecurringPayment.currency = payment_installment.payment_currency;
          orderRecurringPayment.displayTotal = formatCurrency(orderRecurringPayment.total, "en-US", orderRecurringPayment.currency + ' ', "code", "0.2-2"); 

          // improve
          const customer = order.customer;
          orderRecurringPayment.customer = customer.firt_name ? customer.firt_name : "";
          orderRecurringPayment.customer += customer.last_name ? customer.last_name : "";

          const advisorCustomer = customer.advisorCustomer;
          if (advisorCustomer) {
            orderRecurringPayment.advisor = advisorCustomer.firt_name ? advisorCustomer.firt_name : "";
            orderRecurringPayment.advisor += advisorCustomer.last_name ? advisorCustomer.last_name : "";
          }

          listRecurringPayments.push(orderRecurringPayment);
        });

        return { listRecurringPayments: listRecurringPayments, sum: data.data.payment_installmentsSum };
      }),
      catchError((data) => throwError(data))
    );
  }

  getRecurringPaymentCountData(): Observable<any> {
    return this.api.get(countRecurringPayments);
  }


  terminateRecurringPaymentById(installment_id){
    let url = terminateRecurringPaymentByIdApi.replace(':installmentId', installment_id); 
    return this.api.get(url); 

  }




  
}
