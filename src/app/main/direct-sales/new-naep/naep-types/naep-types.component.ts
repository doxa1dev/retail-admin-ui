import { AllModules, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { EditButtonRenderComponent } from './edit-button-render/edit-button-render.component';

@Component({
  selector: 'app-naep-types',
  templateUrl: './naep-types.component.html',
  styleUrls: ['./naep-types.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NaepTypesComponent implements OnInit {

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
    this.newNaepService.getListNaepType().subscribe(data=>{
      this.naepData = data;
      if(data.length == 0 ){
        this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No data</span>`;
      }
    })
  }

  columnDefs = [
    { headerName: "NAEP Types", field: "naep_type" },
    { headerName: "Period Length", field: "period" ,filterParams: { filterOptions: ['inRange']}},
    { headerName: "Action", field: "uuid", "cellRendererFramework": EditButtonRenderComponent ,filterParams: { filterOptions: ['inRange']} }
  ];

  createNewNAEPType(){
    this.router.navigate(['/direct-sales/configuration/create-naep-type']);
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

