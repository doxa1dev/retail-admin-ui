import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { animation } from '@angular/animations';
import { SelectItem } from 'primeng/api';
import * as CARS from '../../../../../assets/DC.json';
import * as DIALS from '../../../../../assets/dialcode.json';


@Component({
  selector: 'app-dialCode',
  templateUrl: './dial-code.component.html',
  styleUrls: ['./dial-code.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations
})
export class DialCodeComponent implements OnInit
{
  selectedDial = '93';

  @Input()
  set SelectedDial(selectedDial: string) {
    this.selectedDial = selectedDial;
  }

  get SelectedDial(): string { return this.selectedDial; }

  dials = (DIALS as any).default;

  constructor(
    private _fuseConfigService: FuseConfigService,
  ) {
    this.dials = (DIALS as any).default;
  }
  ngOnInit(): void { }

}

