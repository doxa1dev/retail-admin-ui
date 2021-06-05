import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'ptpPurchaseRequisition',
  templateUrl: './ptpPurchaseRequisition.component.html',
  styleUrls: ['./ptpPurchaseRequisition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class PtpPurchaseRequisitionComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
