import { AllModules, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { EditButtonRenderComponent } from '../naep-types/edit-button-render/edit-button-render.component';

@Component({
  selector: 'app-naep-process',
  templateUrl: './naep-process.component.html',
  styleUrls: ['./naep-process.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NaepProcessComponent implements OnInit {

  defaultColDef;
  modules = AllModules;
  loadingTemplate;
  naepData = [];
  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'},
  };

  constructor(
    private router: Router,
    private newNaepService: NewNaepService
  ) {
    this.defaultColDef = {
      resizable: true,
      sortable :true , filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton:true}
    };
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">Loading...</span>`;
  }

  ngOnInit(): void {
    this.newNaepService.getListNaepProcess().subscribe(data=>{
      this.naepData = data;
      if(data.length == 0 ){
        this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No data</span>`;
      }
    })
  }

  columnDefs = [
    { headerName: "Process Name", field: "naep_process" },
    { headerName: "Description", field: "description" ,filterParams: { filterOptions: ['inRange']}},
    { headerName: "Action", field: "uuid", "cellRendererFramework": EditButtonRenderComponent ,filterParams: { filterOptions: ['inRange']} }
  ];

  createNewNAEPProcess(){
    this.router.navigate(['/direct-sales/configuration/create-naep-process']);
  }

  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

}

