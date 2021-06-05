import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'entitySetting',
  templateUrl: './entitySetting.component.html',
  styleUrls: ['./entitySetting.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class EntitySettingComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
