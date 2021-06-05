import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class VerifyCodeComponent implements OnInit {

  constructor
    (
      private _fuseConfigService: FuseConfigService
    )         
  {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    }
  }

  ngOnInit(): void {
  }

}
