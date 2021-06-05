import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class SalesComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
