import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GridOptions, GridSizeChangedEvent } from 'ag-grid-community';
import { environment } from 'environments/environment';
import { ShippingAgent } from 'app/core/enum/shipping-agent.enum';

import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

@Component({
  selector: 'app-shipping-status',
  templateUrl: './shipping-status.component.html',
  styleUrls: ['./shipping-status.component.scss']
})
export class ShippingStatusComponent implements OnInit {
  trackingHosts = environment.trackingHosts;

  shippers: string[];

  @Input() shippingAgent;
  @Input() shipmentId;
  @Input() rowData;

  columnApi: any;
  gridApi: any;
  gridOptions: any;

  modules = AllModules

  columnDefs = [
    { headerName: "Group No.", field: "pieceId", sortable: true, filter: true, width: 100, resizable: false, suppressSizeToFit: true },
    { headerName: "Tracking ID", field: "trackingId", sortable: true, filter: true, width: 140, resizable: false, suppressSizeToFit: true, cellRenderer: (params) => { return this.viewTrackingDetails(params); } },
    { headerName: "Product Name", field: "productName", sortable: true, filter: true, resizable: false },
    { headerName: "Qty", field: "quantity", sortable: true, filter: true, width: 80, resizable: false, suppressSizeToFit: true },
    { headerName: "Status", field: "status", sortable: true, filter: true, resizable: false },
    { headerName: "Date", field: "updatedTime", sortable: true, filter: true, width: 100, resizable: false, suppressSizeToFit: true }
  ];

  constructor(
    private router: Router,
  ) {
    this.gridOptions = <GridOptions> {
      context: {
        componentParent: this
      }
    };
  }

  ngOnInit(): void {
    this.shippers = Object.keys(this.trackingHosts);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    params.columnApi.autoSizeColumns(['productName', 'status'], false);
    this.resizeColumnsToFit(false);
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    params.columnApi.autoSizeColumns(['productName', 'status'], false);
    this.resizeColumnsToFit(false);
  }

  private viewTrackingDetails(params) {
    let isAnchorLink = false;
    const trackingId = params.data.trackingId;
    const a = document.createElement('a');
    a.addEventListener('click', event => { event.stopPropagation(); });
    a.target = '_blank';
    a.innerText = trackingId;
    if (this.shippers.indexOf(this.shippingAgent) !== -1) {
      isAnchorLink = true;
      a.href = `${this.trackingHosts[this.shippingAgent]}${trackingId}`;
    }

    return isAnchorLink ? a : trackingId;
  }

  // Source: https://stackoverflow.com/questions/55587083/ag-grid-sizecolumnstofit-only-when-there-is-space-available-in-the-total-grid-width
  // https://github.com/ag-grid/ag-grid/blob/master/community-modules/core/src/ts/gridPanel/gridPanel.ts
  private resizeColumnsToFit(allowShrink = true) {
    if (this.gridApi) {
      if (allowShrink) {
        this.gridApi.sizeColumnsToFit();
      } else {
        /**
         * this is a "hacK" - there is no way to check if there is "empty" space in the grid using the
         * public grid api - we have to use the internal tools here.
         * it could be that some of this apis will change in future releases
         */
        const gridPanel = this.gridApi["gridPanel"];
        const availableWidth = gridPanel.eBodyViewport.clientWidth;
        const columns = gridPanel["columnController"].getAllDisplayedColumns();
        const usedWidth = gridPanel["columnController"].getWidthOfColsInList(columns);

        if (usedWidth < availableWidth) {
          this.gridApi.sizeColumnsToFit();
        }
      }
    }
  }
}
