import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AllModules, GridSizeChangedEvent } from '@ag-grid-enterprise/all-modules';
import { Router } from '@angular/router';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { EditButtonPeriodComponent } from './edit-button-period/edit-button-period.component';
import { PeriodConfigService } from 'app/core/service/period-configuration.service';
import * as moment from "moment";

@Component({
  selector: 'app-period-config',
  templateUrl: './period-config.component.html',
  styleUrls: ['./period-config.component.scss']
})
export class PeriodConfigComponent implements OnInit {
  defaultColDef;
  modules = AllModules;
  loadingTemplate;
  periodData = [];
  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'},
  };
  constructor(
    private router: Router,
    private periodConfigService: PeriodConfigService,
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
    this.periodConfigService.getListPeriod().subscribe(data=>{
      this.periodData = data;
      if(data.length == 0 ){
        this.loadingTemplate =
      `<span class="ag-overlay-loading-center">No data</span>`;
      }
    })
  }

  columnDefs = [
    { headerName: "Period", field: "period" },
    { headerName: "Start Time", field: "startTime" ,filterParams: { filterOptions: ['inRange']}, 
      valueFormatter: (param) => {
        if(new Date(param.value).getMinutes() < 10) {
          return moment(param.value).format("DD/MM/YYYY") + ' ' + new Date(param.value).getHours() + ':0' + new Date(param.value).getMinutes();
        }
        else return moment(param.value).format("DD/MM/YYYY") + ' ' + new Date(param.value).getHours() + ':' + new Date(param.value).getMinutes();
      },
    },
    { headerName: "End Time", field: "endTime" ,filterParams: { filterOptions: ['inRange']},
      valueFormatter: (param) => {
        if(new Date(param.value).getMinutes() < 10) {
            return moment(param.value).format("DD/MM/YYYY") + ' ' + new Date(param.value).getHours() + ':0' + new Date(param.value).getMinutes();
          }
        else return moment(param.value).format("DD/MM/YYYY") + ' ' + new Date(param.value).getHours() + ':' + new Date(param.value).getMinutes();
      },
    },
    // { headerName: "Status", field: "status", "cellRendererFramework": EditButtonPeriodComponent ,filterParams: { filterOptions: ['inRange']}},
    { headerName: "Status", field: "status" ,filterParams: { filterOptions: ['inRange']}},
    { headerName: "Consolidation", field: "consolidation", 
      valueFormatter: (param => {
        return this.convertString(param.value)
      })
    },
  ];

  createNewPeriodConfig(){
    this.router.navigate(['/direct-sales/hierarchy-ranking/create-period-config']);
  }

  onGridReady(params)
  {
    params.api.sizeColumnsToFit();
  }
  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    params.api.sizeColumnsToFit();
  }

  convertString(str){
    return str.replace(/_|-/g, " ");
  }

  onRowClickedChangeToPeriod(event) {
    this.router.navigate(['direct-sales/hierarchy-ranking/create-period-config'], { queryParams: { periodId: event.data.id } });
  };

}



