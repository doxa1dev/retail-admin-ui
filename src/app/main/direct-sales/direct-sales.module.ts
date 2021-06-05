import { NgModule } from '@angular/core';

//Products
import { AllProductsModule } from './products/all-products/allProducts.module';
import { CategoriesModule } from './products/categories/categories.module';
import { InventorysModule } from './products/inventory/inventory.module';

import { OrdersModule } from './orders/orders.module';
import { SalesModule } from './sales/sales.module';
import { NewsModule } from './news/all-news/news.module';
import { StockHistoryModule } from './products/stock-history/stock-history.module';
import { NewsInsightModule } from './news/news-insight/news-insight.module';
import { BranchModule } from './sales-team/branch/branch.module';
import { LineChartModule } from './news/chart/line-chart/line-chart.module';
import { BarChartModule } from './news/chart/bar-chart/bar-chart.module';
import { SingleBarChartModule } from './news/chart/single-bar-chart/single-bar-chart.module';
import { WarrantiedProductsModule } from './products/warrantied-products/warrantied-products.module';
import { SpecialProductsModule } from './products/special-products/special-products.module';
import { NAEPModule } from './sales-team/naep/naep.module';

import { RecurringPaymentsModule } from './recurring-payments/recurring-payments.module';

import { ReportsModule } from './reports/reports.module';
import { CustomerInformationModule } from './customers/customer-information/customer-information.module';
import { CustomersModule } from './customers/customers.module';
import { TranslationModule } from './products/translation/translation.module';
import { NewNaepModule } from './new-naep/new-naep.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { BannerModule } from './news/banner/banner.module';
import { WeightBasedShippingModule } from './products/weight-based-shipping/weight-based-shipping.module';
import { HostGiftModule } from './host-gift/host-gift.module';
import { DataTransferCheckModule } from './data-transfer-check/data-transfer-check.module';
import { HierarchyRankingModule } from './hierarchy-ranking/hierarchy-ranking.module';
import { JustHostModule } from './just-host/just-host.module';

@NgModule({
    imports: [
        // Products
        AllProductsModule,
        CategoriesModule,
        InventorysModule,

        OrdersModule,
        SalesModule,
        NewsModule,
        StockHistoryModule,
        WarrantiedProductsModule,
        NewsInsightModule,
        BranchModule,
        LineChartModule,
        BarChartModule,
        SingleBarChartModule,

        SpecialProductsModule, NAEPModule,
        RecurringPaymentsModule,

        SpecialProductsModule, NAEPModule,ReportsModule,
        CustomerInformationModule,
        CustomersModule,
        TranslationModule,
        NewNaepModule,
        WarehouseModule,

        BannerModule,

        WeightBasedShippingModule,

        HostGiftModule,

        DataTransferCheckModule,
        HierarchyRankingModule,
        JustHostModule
    ],
    exports:[],
    declarations: [],
})
export class DirectSalesModule
{

}
