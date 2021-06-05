import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'otcRequest',
  templateUrl: './otcRequest.component.html',
  styleUrls: ['./otcRequest.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class OtcRequestComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
