import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { NavbarVerticalStyle1Component } from 'app/layout/components/navbar/vertical/style-1/style-1.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list'
@NgModule({
    declarations: [
        NavbarVerticalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        FuseSharedModule,
        FuseNavigationModule,
        MatFormFieldModule,
        MatListModule
    ],
    exports     : [
        NavbarVerticalStyle1Component
    ]
})
export class NavbarVerticalStyle1Module
{
}
