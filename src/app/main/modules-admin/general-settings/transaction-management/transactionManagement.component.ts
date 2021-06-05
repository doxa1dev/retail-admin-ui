import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'transactionManagement',
  templateUrl: './transactionManagement.component.html',
  styleUrls: ['./transactionManagement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class TransactionManagementComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
