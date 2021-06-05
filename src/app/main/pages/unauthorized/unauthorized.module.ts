import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from './unauthorized.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatCarouselModule } from '@ngmodule/material-carousel';

const routes = [
  {
      path: 'unauthorized',
      component: UnauthorizedComponent
  }
];

@NgModule({
  declarations: [
    UnauthorizedComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    MatCarouselModule.forRoot(),
  ],
  exports: [
    UnauthorizedComponent,
]
})
export class UnauthorizedModule { }
