import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from './main/angular-material/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import 'hammerjs';
import { AgGridModule } from '@ag-grid-community/angular';
import * as $ from 'jquery';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';
import { EditorModule } from 'primeng/editor';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { PagesModule } from './main/pages/pages.module';
import { ShareModule } from './main/_shared/_share.module';
// import { LoginComponent} from './main/pages/authentication/login/login.component';
// import { RegisterComponent } from './main/pages/authentication/register/register.component';
// import { VerifyCodeComponent } from './main/pages/authentication/verify-code/verify-code.component';
// import { ForgotPasswordComponent } from './main/pages/authentication/forgot-password/forgot-password.component';
import { DirectSalesModule } from './main/direct-sales/direct-sales.module';
import { ModulesModule } from './main/modules-admin/modules.module';
import { DialCodeComponent } from './main/pages/authentication/dial-code/dial-code.component';

import { AllProductsComponent } from './main/direct-sales/products/all-products/allProducts.component';
//Service
import { LoginService } from './main/pages/authentication/login/login.service';

import { ToPayActionComponent } from '../app/main/direct-sales/orders/page-action/to-pay-action/to-pay-action.component';
import { ToPayActionModule } from '../app/main/direct-sales/orders/page-action/to-pay-action/to-pay-action.module';

import { ToVerifyActionComponent } from '../app/main/direct-sales/orders/page-action/to-verify-action/to-verify-action.component';
import { ToVerifyActionModule } from '../app/main/direct-sales/orders/page-action/to-verify-action/to-verify-action.module';

import { ToShipActionComponent } from '../app/main/direct-sales/orders/page-action/to-ship-action/to-ship-action.component';
import { ToShipActionModule } from '../app/main/direct-sales/orders/page-action/to-ship-action/to-ship-action.module';

import { ToReceiveActionComponent } from '../app/main/direct-sales/orders/page-action/to-receive-action/to-receive-action.component';
import { ToReceiveActionModule } from '../app/main/direct-sales/orders/page-action/to-receive-action/to-receive-action.module';

import { ToHostActionComponent } from '../app/main/direct-sales/orders/page-action/to-host-action/to-host-action.component';
import { ToHostActionModule } from '../app/main/direct-sales/orders/page-action/to-host-action/to-host-action.module';

import { ToUnboxActionComponent } from '../app/main/direct-sales/orders/page-action/to-unbox-action/to-unbox-action.component';
import { ToUnboxActionModule } from '../app/main/direct-sales/orders/page-action/to-unbox-action/to-unbox-action.module';

import { CompletedActionComponent } from '../app/main/direct-sales/orders/page-action/completed-action/completed-action.component';
import { CompletedActionModule } from '../app/main/direct-sales/orders/page-action/completed-action/completed-action.module';

import { CancelledActionComponent } from '../app/main/direct-sales/orders/page-action/cancelled-action/cancelled-action.component';
import { CancelledActionModule } from '../app/main/direct-sales/orders/page-action/cancelled-action/cancelled-action.module';
import { DialogReasonModule } from './main/_shared/dialog-reason/dialog-reason.module';
import { SharedService } from './core/service/shared.service';
import { DialogSelectDateNaepModule } from './main/_shared/dialog-select-date-naep/dialog-select-date-naep.module';
import { PaymentInProcessComponent } from './main/direct-sales/recurring-payments/page-action/payment-in-process/payment-in-process.component';
import { PaymentInProcessModule } from './main/direct-sales/recurring-payments/page-action/payment-in-process/payment-in-process.module';
import { CompletedPaymentsComponent } from './main/direct-sales/recurring-payments/page-action/completed-payments/completed-payments.component';
import { CompletedPaymentsModule } from './main/direct-sales/recurring-payments/page-action/completed-payments/completed-payments.module';
import { TerminatedPaymentsComponent } from './main/direct-sales/recurring-payments/page-action/terminated-payments/terminated-payments.component';
import { TerminatedPaymentsModule } from './main/direct-sales/recurring-payments/page-action/terminated-payments/terminated-payments.module';
import { ConfirmDialogComponent} from 'app/main/_shared/confirm-dialog/confirm-dialog.component'
import { UnauthorizedModule } from './main/pages/unauthorized/unauthorized.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DialogTextareaCommentComponent } from 'app/main/_shared/dialog-textarea-comment/dialog-textarea-comment.component';
import { DialogTextareaImageCommentComponent } from 'app/main/_shared/dialog-textarea-image-comment/dialog-textarea-image-comment.component';
import { ForgotPasswordComponent } from './main/pages/authentication/forgot-password/forgot-password.component';

const appRoutes: Routes = [
  // {
  //     path      : 'pages',
  //     loadChildren: './main/pages/pages.module#PagesModule'
  // },
  {
    path: 'direct-sales',
    component: AllProductsComponent
  },

  // {
  //     path: 'ngprime',
  //     component: DialCodeComponent
  // },
  // {
  //     path: 'register',
  //     component: RegisterComponent
  // },
  // {
  //     path : 'register/verify',
  //     component: VerifyCodeComponent
  // },
  // {
  //     path: 'forgot-password',
  //     component: ForgotPasswordComponent
  // },
  //   {
  //     path: 'forgot-password/:token',
  //     component: ForgotPasswordComponent
  // },
  {
    path: 'direct-sales',
    loadChildren: './main/direct-sales/direct-sales.module#DirectSalesModule'
  },
  {
    path: 'modules',
    loadChildren: './main/modules-admin/modules.module#ModulesModule'
  },
  {
    path: 'orders/to-pay',
    component: ToPayActionComponent
  },
  {
    path: 'orders/to-verify',
    component: ToVerifyActionComponent
  },
  {
    path: 'orders/to-ship',
    component: ToShipActionComponent
  },
  {
    path: 'orders/to-receive',
    component: ToReceiveActionComponent
  },
  {
    path: 'orders/to-host',
    component: ToHostActionComponent
  },
  {
    path: 'orders/to-unbox',
    component: ToUnboxActionComponent
  },
  {
    path: 'orders/completed',
    component: CompletedActionComponent
  },
  {
    path: 'orders/cancelled',
    component: CancelledActionComponent
  },
  {
    path: '**',
    redirectTo: 'direct-sales'
  },

  {
    path: 'recurring-payments/payment-in-process',
    component: PaymentInProcessComponent
  },

  {
    path: 'recurring-payments/completed-payments',
    component: CompletedPaymentsComponent
  },

  {
    path: 'recurring-payments/terminated-payments',
    component: TerminatedPaymentsComponent
  }



];

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDialogComponent,
    DialogTextareaCommentComponent,
    DialogTextareaImageCommentComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot(),
    AgGridModule.withComponents(),
    FormsModule,
    ReactiveFormsModule,

    PagesModule,
    ShareModule,
    DirectSalesModule,
    ModulesModule,
    NgxQRCodeModule,
    // Material
    MaterialModule,

    // Fuse modules
    FuseModule.forRoot(fuseConfig),
    FuseProgressBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    FuseThemeOptionsModule,

    // App modules
    LayoutModule,
    SampleModule,
    // ngprime
    DropdownModule,
    EditorModule,

    ToPayActionModule,
    ToVerifyActionModule,
    ToShipActionModule,
    ToReceiveActionModule,
    ToHostActionModule,
    ToUnboxActionModule,
    CompletedActionModule,
    CancelledActionModule,
    DialogSelectDateNaepModule,

    PaymentInProcessModule,
    CompletedPaymentsModule,
    TerminatedPaymentsModule,
    UnauthorizedModule
  ],
  providers: [LoginService , SharedService]
  ,
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
