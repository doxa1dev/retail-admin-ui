import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { SalesMonitorDetail, SalesMonitorService } from 'app/core/service/sales-monitor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';

@Component({
  selector: 'app-sale-monitor-detail',
  templateUrl: './sale-monitor-detail.component.html',
  styleUrls: ['./sale-monitor-detail.component.scss']
})
export class SaleMonitorDetailComponent implements OnInit {

  salesMonitorDetailData = new SalesMonitorDetail();
  id: string;
  selectPeroid: any;
  peroidId: any;

  constructor(private location: Location,
    private salesMonitorService: SalesMonitorService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params.id;
    });

    this.salesMonitorService.getSalesMonitorDetail(this.id).subscribe(data => {
      this.salesMonitorDetailData = data;
      this.selectPeroid = this.salesMonitorDetailData.periodSale;
      this.peroidId = this.salesMonitorDetailData.periodSale.id;
    })
  }

  back() {
    this.location.back();
  }

  selectedPeriod(event) {
    this.selectPeroid = event.value;
  }

  updateSaleMonitorPeriod() {
    if (this.selectPeroid.id == this.peroidId) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to update this Sales Monitor Period?', type: "APPROVED" }
    });

    dialogRef.afterClosed().subscribe(isCheck => {
      if (isCheck) {
        this.salesMonitorService.updateSalesMonitorDetail(this.id, this.selectPeroid.id).subscribe(
          data => {
            if (data.code == 200) {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Update Sales Monitor Period Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });

              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/hierarchy-ranking/sale-monitor']);
              });
            }
          }
        )

      } else {
        dialogRef.close();
      }
    })
  }
}
