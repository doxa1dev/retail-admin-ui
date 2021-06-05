import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'ptpRequest',
  templateUrl: './ptpRequest.component.html',
  styleUrls: ['./ptpRequest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class PtpRequestComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
