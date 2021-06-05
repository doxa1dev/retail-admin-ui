import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AllModules, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Router } from '@angular/router';
import { EditButtonRenderComponent } from '../naep-types/edit-button-render/edit-button-render.component';
import { NewNaepService } from 'app/core/service/new-naep.service';

@Component({
  selector: 'app-naep-packages',
  templateUrl: './naep-packages.component.html',
  styleUrls: ['./naep-packages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NaepPackagesComponent implements OnInit {

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
    this.newNaepService.getListNaepPackage().subscribe(data=>{
      this.naepData = data;
      if(data.length == 0 ){
        this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No data</span>`;
      }
    })
  }

  columnDefs = [
    { headerName: "Package Name", field: "naep_package" },
    { headerName: "Description", field: "description" ,filterParams: { filterOptions: ['inRange']}},
    { headerName: "Availability", field: "is_active", cellRenderer: isActiveRenderer ,filterParams: { filterOptions: ['inRange']} },
    { headerName: "Action",field: "uuid", "cellRendererFramework": EditButtonRenderComponent, filterParams: { filterOptions: ['inRange']} }
  ];

  createNewNAEPPackages(){
    this.router.navigate(['/direct-sales/configuration/create-naep-packages']);
  }

  updateNewNAEPPackages(event){
    // console.log(event)
    this.router.navigate(['/direct-sales/configuration/create-naep-packages'] , {queryParams: {uuid: event.data.uuid.uuid }});
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

function isActiveRenderer(params)
{
  let imgSource: string;
  const data = params.value;
  if (data === true){
    imgSource = `<div style="color:#269A3E";>Active</div>`
  }else{
    imgSource = `<div style="color:#DE3535";>Inactive</div>`
  }
  return imgSource;
}

function buttonEdit(params)
{
  let btnRender: string;
  btnRender = `<button></button>`
}
