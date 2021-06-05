import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'ptpPurchaseOrder',
  templateUrl: './ptpPurchaseOrder.component.html',
  styleUrls: ['./ptpPurchaseOrder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class PtpPurchaseOrderComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
