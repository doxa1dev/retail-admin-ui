import { NgModule } from '@angular/core';
import { AlertModule} from './alert/alert.module'
import { TimeLineModule } from './timeline/timeline.module';
import { DialogChangePaymentTypeModule } from './dialog-change-payment-type/dialog-change-payment-type.module';

@NgModule({
    imports: [
        AlertModule,
        TimeLineModule,
        DialogChangePaymentTypeModule
    ],
    exports: [
    ],
    declarations: []
})
export class ShareModule
{

}
