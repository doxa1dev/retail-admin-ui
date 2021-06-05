import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'otcAPInvoice',
  templateUrl: './otcAPInvoice.component.html',
  styleUrls: ['./otcAPInvoice.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class OtcAPInvoiceComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
