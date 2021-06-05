import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { ForgotPasswordComponent } from './forgot-password.component'
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { AlertModule } from '../../../_shared/alert/alert.module';

const routes = [
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'forgot-password/:token',
    component: ForgotPasswordComponent
  },
];

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports: [
      RouterModule.forChild(routes),

        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        MatCarouselModule.forRoot(),
        AlertModule
    ],
    exports: [
        ForgotPasswordComponent,
    ]
})

export class ForgotPasswordModule
{
}
