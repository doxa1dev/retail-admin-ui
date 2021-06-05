import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'ptpAPInvoice',
  templateUrl: './ptpAPInvoice.component.html',
  styleUrls: ['./ptpAPInvoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class PtpAPInvoiceComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
