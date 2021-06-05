import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { ProfileComponent} from './profile.component'
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AgGridModule } from '@ag-grid-community/angular';
import { PasswordDirective } from './re-password.directive';
import { DndDirective } from 'app/main/_shared/dnd.directive';
const routes = [
    {
        path: 'profile',
        component: ProfileComponent
    }
];

@NgModule({
    declarations: [
      ProfileComponent, PasswordDirective,DndDirective
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        DropdownModule,
        CalendarModule,
        AgGridModule
    ],
    exports: [
      ProfileComponent,
    ]
})

export class ProfileModule
{
}
