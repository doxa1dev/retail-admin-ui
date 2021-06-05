import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit } from '@angular/core';
import { GridSizeChangedEvent } from 'ag-grid-community';
import { AdminRoles } from 'app/core/enum/admin-roles.enum';
import { Location } from '@angular/common';
import { NaepAdminRole } from 'app/core/models/naep.model';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { OptionalCheckboxComponent } from './optional-checkbox/optional-checkbox.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';

@Component({
  selector: 'app-naep-roles',
  templateUrl: './naep-roles.component.html',
  styleUrls: ['./naep-roles.component.scss']
})
export class NaepRolesComponent implements OnInit {


  listAdminRole: NaepAdminRole[] = [];
  defaultColDef;
  loadingTemplate;
  modules = AllModules;
  gridApi;
  listUpdate = {
    adminRole: [

    ]
  }
  
  
  constructor(
    private newNaepService: NewNaepService,
    private location : Location,
    public dialog: MatDialog,
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
    this.newNaepService.getListAdminRole().subscribe(
      data => {
        this.listAdminRole = data;
      }
    )
  }


  gridOptions = {
    rowHeight : 50,
    rowStyle : { 'padding': '10px 0px'},
    resizable: true,
    context: {
      componentParent: this
    }
  };
  columnDefs = [
    { headerName: "Select", field: "isSelect" ,"cellRendererFramework": OptionalCheckboxComponent, "cellEditorFramework": OptionalCheckboxComponent , width: 100, cellStyle: { 'text-align': 'center' }},
    { headerName: "Email", field: "email", minWidth:  150},
    { headerName: "Retail Super Admin", field: "retail_super_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
    { headerName: "Marketing Admin", field: "marketing_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
    { headerName: "Retail Admin", field: "retail_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
    { headerName: "Retail Wh Admin", field: "retail_wh_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' }, width: 140},
    { headerName: "Retail Cs Admin", field: "retail_cs_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
    { headerName: "Retail It Admin", field: "retail_it_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
    { headerName: "Retail Ac Admin", field: "retail_ac_admin" , "cellRendererFramework": OptionalCheckboxComponent, cellStyle: { 'text-align': 'center' } , width: 140},
  ];

  onGridReady(params)
  {
    this.gridApi = params.api;
  }

  onGridSizeChanged(params: GridSizeChangedEvent)
  {
    // params.api.sizeColumnsToFit();
  }

  back(){
    this.location.back();
  }

  async updateColumnData(rowId: number, field: string, fieldValue: boolean){
    let rowNode = this.gridApi.getRowNode(rowId.toString());
    await rowNode.setDataValue(field, fieldValue);
    let data: NaepAdminRole = rowNode.data;
    if(data.isSelect === true){
      let roleSelected = [];
      if(data.retail_super_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_SUPER_ADMIN)
      }
      if(data.retail_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_ADMIN)
      }
      if(data.marketing_admin === true) {
        roleSelected.push(AdminRoles.MARKETING_ADMIN)
      }
      if(data.retail_wh_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_WH_ADMIN)
      }
      if(data.retail_cs_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_CS_ADMIN)
      }
      if(data.retail_it_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_IT_ADMIN)
      }
      if(data.retail_ac_admin === true) {
        roleSelected.push(AdminRoles.RETAIL_AC_ADMIN)
      }
      
      let object = this.listUpdate.adminRole.find(x => x.email === data.email)
      if(object) {
        object.role = roleSelected
      } else {
        this.listUpdate.adminRole.push({
          email: data.email,
          role: roleSelected
        })
      } 
    } else {
      this.listUpdate.adminRole = this.listUpdate.adminRole.filter((item) => {
        return item.email !== data.email
      })
    }
  }
  test(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to update admin roles?', type: "APPROVED" }
    });

    dialogRef.afterClosed().subscribe(
      result => {
        if(result === true) {
          let bodyJson = JSON.stringify(this.listUpdate);
          console.log(bodyJson)
          this.newNaepService.updateAdminRole(bodyJson).subscribe(
            data => {
              if(data.code === 200) {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      `${data.message}`,
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
              } else {
                const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                  width: "600px",
                  data: {
                    message:
                      `${data.message}`,
                    title:
                      "NOTIFICATION",
                    colorButton: false
                  },
                });
              }
              
            }
          )
        } else {
          dialogRef.close();
        }
      }
    )
  }
}
