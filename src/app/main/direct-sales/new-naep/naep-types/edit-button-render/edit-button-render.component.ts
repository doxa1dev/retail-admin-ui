import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-button-render',
  templateUrl: './edit-button-render.component.html',
  styleUrls: ['./edit-button-render.component.scss']
})
export class EditButtonRenderComponent implements OnInit {

  constructor(
    private router: Router,
  ) { }

  gridApi: any;
  value: any;
  params: any;
  id: any;


  agInit(params) {
    this.gridApi = params.api;
    this.params = params;
    this.id = params.data.id;
    this.value = params.value;
    // console.log(this.params.context.componentParent)
    // this.rowNode = this.gridApi.getRowNode(this.params.node.id);

  }

  ngOnInit(): void {
  }

  goToEdit(){
    if(this.value.type === 'TYPE'){
      this.router.navigate(['direct-sales/configuration/create-naep-type'], { queryParams: { uuid: this.value.uuid } });
    }else if(this.value.type === 'PROCESS'){
      this.router.navigate(['direct-sales/configuration/create-naep-process'], { queryParams: { uuid: this.value.uuid } });
    }else if(this.value.type === 'PACKAGE'){
      this.router.navigate(['direct-sales/configuration/create-naep-packages'], { queryParams: { uuid: this.value.uuid } });
    }
  }

}
