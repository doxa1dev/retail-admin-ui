import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
import { GridSizeChangedEvent } from 'ag-grid-community';
import { Router } from '@angular/router';
import { CategoryService } from 'app/core/service/category.service';
import { Category } from 'app/core/models/category.model';
import { SelectItem } from 'primeng/api/selectitem';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
@Component({
    selector: 'allProducts',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CategoriesComponent implements OnInit {
    loadingTemplate;
    defaultColDef;
    products = [];
    modules = AllModules
    gridOptions = {
        rowHeight: 50,
        rowStyle: { 'padding': '10px 0px' }
    };
    columnDefs = [
        { headerName: "Categories", field: "categoryName", width: 300, resizable: true, sortable: true },
        { headerName: "Active", field: "isActive", cellRenderer: isActiveRenderer, width: 120, resizable: false, cellStyle: { textAlign: "center" }, filterParams: { filterOptions: ['inRange'] } }
    ];

    listActiveCategory: any[];
    categoryDefault: any;
    defaultCategory: FormControl;

    constructor(
        private router: Router,
        private categoryService: CategoryService,
        public dialog: MatDialog,
    ) {
        this.defaultColDef = {
            filter: 'agTextColumnFilter',
            resizable: true,
            suppressMenu: true,
            floatingFilterComponentParams: { suppressFilterButton: true }
        };
        this.loadingTemplate = `<span class="ag-overlay-loading-center">Loading...</span>`;
        this.listActiveCategory = [];
        this.categoryDefault = "";
        this.defaultCategory = new FormControl('');
    }

    ngOnInit(): void {
        this.GetListCategory();
    }
    /**
   * get list category
   * @returns Product array
   */
    GetListCategory(): Promise<any> {
        return new Promise(resolve => {
            this.categoryService.getCategoryList().subscribe(
                response => {
                    this.products = response;
                    if (this.products.length == 0) {
                        this.loadingTemplate = `<span class="ag-overlay-loading-center">No data</span>`;
                    }
                    this.listActiveCategory = this.products.filter(element => element.isActive === true);
                    this.categoryDefault = this.listActiveCategory.find(element => element.isDefaultCategory === true);
                    this.defaultCategory.setValue(this.categoryDefault);
                });
        });
    }
    onGridReady(params) {
        params.api.sizeColumnsToFit();
    }
    onGridSizeChanged(params: GridSizeChangedEvent) {
        params.api.sizeColumnsToFit();
    }
    gotoProduct() {
        this.router.navigate(['/direct-sales/products/categories/add-category']);
    }
    onViewProduct(event) {
        this.router.navigate(['direct-sales/products/categories/add-category'], { queryParams: { id: event.data.id } })
    };

    selectDefaultCategory(event) {
        const { value } = event;

        if (value) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '500px',
                data: { message: 'Do you wish to set this category to default category?', type: "APPROVED" }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result === true) {
                    this.categoryService.setDefaultCategory(value.id).subscribe(response => {
                        if (response && response.code === 200) {
                            this.categoryDefault = value;
                            this.defaultCategory.setValue(value);
                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                width: "500px",
                                data: {
                                    message: 'Set default category successfully.',
                                    title: "NOTIFICATION",
                                    colorButton: false
                                },
                            });
                            dialogNotifi.afterClosed().subscribe(data => { return; })
                        } else if (response && response.code !== 200) {
                            this.defaultCategory.setValue(this.categoryDefault);
                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                width: "500px",
                                data: {
                                    message: response.message,
                                    title: "ERROR",
                                    colorButton: true
                                },
                            });
                            dialogNotifi.afterClosed().subscribe(data => { return; })
                        } else {
                            this.defaultCategory.setValue(this.categoryDefault);
                            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                                width: "500px",
                                data: {
                                    message: "Something went wrong! Please try again later!",
                                    title: "ERROR",
                                    colorButton: true
                                },
                            });
                            dialogNotifi.afterClosed().subscribe(data => { return; })
                        }
                    })
                } else {
                    this.defaultCategory.setValue(this.categoryDefault);
                }
            })
        } else {
            this.defaultCategory.setValue(this.categoryDefault);
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                    message: "Something went wrong! Please try again later!",
                    title: "ERROR",
                    colorButton: true
                },
            });
            dialogNotifi.afterClosed().subscribe(data => { return; })
        }
    }
}
function isActiveRenderer(params) {
    // console.log(params)
    let imgSource: string;
    const data = params.value;
    if (data === true) {
        imgSource = `<img src="assets/icons/doxa-icons/ic_check_circle_24px.svg" vertical-align:'middle'/>`
    } else {
        imgSource = `<img src="assets/icons/doxa-icons/none.svg" />`
    }
    return imgSource;
}
