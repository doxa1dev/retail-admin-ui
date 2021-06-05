import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-button-period',
  templateUrl: './edit-button-period.component.html',
  styleUrls: ['./edit-button-period.component.scss']
})
export class EditButtonPeriodComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  gridApi: any;
  value: any;
  params: any;
  id: any;
  isLocked: boolean = false


  agInit(params) {
    this.gridApi = params.api;
    this.params = params;
    this.id = params.data.id;
    this.value = params.value;
  }

  ngOnInit(): void {
  }

  goToEdit(){
    if(this.value === 'EDIT'){
      this.router.navigate(['direct-sales/hierarchy-ranking/create-period-config'], { queryParams: { periodId: this.id } });
    }else if(this.value.type === 'PROCESS'){
      this.router.navigate(['direct-sales/configuration/create-naep-process'], { queryParams: { uuid: this.value.uuid } });
    }else if(this.value.type === 'PACKAGE'){
      this.router.navigate(['direct-sales/configuration/create-naep-packages'], { queryParams: { uuid: this.value.uuid } });
    }
  }

}
