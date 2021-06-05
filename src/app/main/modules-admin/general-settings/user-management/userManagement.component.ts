import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'userManagement',
  templateUrl: './userManagement.component.html',
  styleUrls: ['./userManagement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations : fuseAnimations
})
export class UserManagementComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {

  }

}
