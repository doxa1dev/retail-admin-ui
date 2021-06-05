import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { TranslationComponent } from './translation.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { HttpClientModule } from '@angular/common/http';
import { CreateTranslationComponent } from './create-translation/create-translation.component';
import { TranslationDetailComponent } from './translation-detail/translation-detail.component';
import { DropdownModule } from 'primeng/dropdown';
const routes = [
    {
        path: 'direct-sales/products/translation',
        component: TranslationComponent
    },
    {
      path: 'direct-sales/products/translation/create',
      component: CreateTranslationComponent
    },
    {
      path: 'direct-sales/products/translation/detail',
      component: TranslationDetailComponent
    }
];

@NgModule({
    declarations: [
        TranslationComponent,
        CreateTranslationComponent,
        TranslationDetailComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        HttpClientModule,
        AgGridModule.withComponents([]),
        DropdownModule
    ],
    exports: [
        TranslationComponent,
    ]
})

export class TranslationModule
{
}
