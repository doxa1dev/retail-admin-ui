import { IAfterGuiAttachedParams } from '@ag-grid-community/all-modules';
import { ICellEditorAngularComp, ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-optional-checkbox',
  templateUrl: './optional-checkbox.component.html',
  styleUrls: ['./optional-checkbox.component.scss']
})
export class OptionalCheckboxComponent implements OnInit, ICellRendererAngularComp {

  params: any;
  is_checked: boolean;
  constructor() { }
  refresh(params: any): boolean {
    return false;
    //throw new Error('Method not implemented.');
  }
  afterGuiAttached?(params?: IAfterGuiAttachedParams): void {
    throw new Error('Method not implemented.');
  }
  

  agInit(params: any): void {
    this.params = params;
    this.is_checked = params.value;
  }

  ngOnInit(){

  }

  checkedHandler(event) {
    let rowId = this.params.node.id;
    let field = this.params.colDef.field;
    let fieldValue = !this.is_checked;
    this.params.context.componentParent.updateColumnData(rowId, field, fieldValue);
}

}
