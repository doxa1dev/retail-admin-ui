import { NgModule } from '@angular/core';

//Authentication
import { LoginModule} from './authentication/login/login.module';
import { ForgotPasswordModule} from './authentication/forgot-password/forgot-password.module';
import { RegisterModule} from './authentication/register/register.module';
import { VerifyCodeModule} from './authentication/verify-code/verifyCode.module';
import { DialCodeModule } from './authentication/dial-code/dial-code.module'
import { DropdownModule } from 'primeng/dropdown';
import { LoginComponent } from './authentication/login/login.component';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { UnauthorizedModule } from './unauthorized/unauthorized.module';
import { ProfileModule } from './authentication/profile/profile.module';
import { NewPasswordComponent } from './authentication/new-password/new-password.component';

@NgModule({
    imports: [
        // Authentication
        LoginModule,
        ForgotPasswordModule,
        RegisterModule,
        VerifyCodeModule,
        DialCodeModule,
        DropdownModule,
        UnauthorizedModule,
        ProfileModule,
        MatCarouselModule.forRoot(),
    ],
    exports:[

        LoginComponent,
        // UnauthorizedComponent
        // ForgotPasswordComponent,
        // RegisterComponent,
        // VerifyCodeComponent
    ],
    declarations: [NewPasswordComponent]
})
export class PagesModule
{

}
