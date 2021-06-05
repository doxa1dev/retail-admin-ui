export class OrderRecurringPaymentTable{
    id_tmm: string;
    order_id: string;
    updatedAt: string;
    installment_process: string; 
    customer: string;
    advisor: string;
    total: number;
    startDate: string; 
    status: string;
    currency: string;
    displayTotal: string;
    installment_id: number; 


    constructor(){
      this.id_tmm = "";
      this.order_id = "";
      this.updatedAt = "";
      this.customer = "";
      this.status = "";
      this.advisor = "";
      this.currency = "";
      this.installment_process = "";
      this.startDate = "";
      this.displayTotal = "";
    }
  }
  