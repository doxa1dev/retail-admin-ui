import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'orc',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class OrcComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
