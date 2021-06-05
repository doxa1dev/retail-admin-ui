import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'otcPurchaseOrder',
  templateUrl: './otcPurchaseOrder.component.html',
  styleUrls: ['./otcPurchaseOrder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class OtcPurchaseOrderComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
