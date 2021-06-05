import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { LoginComponent} from './login.component';
import { AlertModule} from '../../../_shared/alert/alert.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatCarouselModule } from '@ngmodule/material-carousel';
const routes = [
    {
        path: 'login',
        component: LoginComponent
    }
];

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        NgbModule,
        MatCarouselModule.forRoot(),
    ],
    exports: [
        LoginComponent,
    ]
})

export class LoginModule
{
}
