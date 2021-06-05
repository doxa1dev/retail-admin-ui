import { NgModule } from '@angular/core';

//Products
import { EntitySettingModule } from './general-settings/entity-settings/entitySetting.module';
import { TransactionManagementModule } from './general-settings/transaction-management/transactionManagement.module';
import { UserManagementModule } from './general-settings/user-management/userManagement.module'

import { OrcModule } from './ocr/ocr.module';

import { OtcAPInvoiceModule } from './order-to-cash/AP-invoice/otcAPInvoice.module';
import { OtcRequestModule } from './order-to-cash/request-for-quote/otcRequest.module';
import { OtcPurchaseOrderModule } from './order-to-cash/purchase-order/otcPurchaseOrder.module';


import { PtpAPInvoiceModule } from './purchase-to-payment/AP-invoice/ptpAPInvoice.module';
import { PtpRequestModule } from './purchase-to-payment/Request-for-quote/ptpRequest.module';
import { PtpPurchaseOrderModule } from './purchase-to-payment/purchase-order/ptpPurchaseOrder.module';
import { PtpPurchaseRequisitionModule } from './purchase-to-payment/purchase-requisition/ptpPurchaseRequisition.module'

@NgModule({
    imports: [
        // Products
        EntitySettingModule,
        TransactionManagementModule,
        UserManagementModule,

        OrcModule,

        OtcAPInvoiceModule,
        OtcRequestModule,
        OtcPurchaseOrderModule,

        PtpAPInvoiceModule,
        PtpRequestModule,
        PtpPurchaseOrderModule,
        PtpPurchaseRequisitionModule


    ],
    exports:[
    ]
})
export class ModulesModule
{

}
