import { ConfirmDialogComponent } from './../../../_shared/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';
import { NewsService } from 'app/core/service/news.service';
import * as CURRENCY from 'assets/currency.json';
import {FormControl, FormGroup, Validators, FormBuilder, FormArray} from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  selectedCategory =['4'];
  storageUrl = environment.storageUrl;
  categories: SelectItem[];
  title: string;
  productForm :FormGroup;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  options = [];
  minDateStart: Date = new Date();
  minDateEnd: Date  = new Date();
  disable: boolean = true;
  currency = (CURRENCY as any).default;
  selectedCurrency: string = "SGD";
  text2 : string;
  sku: string="";
  checkShippingWeight : boolean = false;
  checkVariant: boolean = false;
  checkActive: boolean =true;
  hasAvisor: boolean =false;
  hasSpecialPayment: boolean =false;
  files: any[] = [];
  public imagePath;
  imgURL: any;
  imageArray = []
  imageArrayTest = []
  isCreate : boolean = true;

  propertiesArray: FormGroup;
  property : FormGroup;
  propertiesValueArray: string[][] = [];
  submitted: boolean = false;
  currencyPattern = /^[0-9,]+(\.[0-9]{1,2})?$/;
  banners;
  isSave: boolean = false;

  constructor(
    private _location : Location,
    private newsService: NewsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
  ) {
    this.currency = (CURRENCY as any).default;
   }
  ngOnInit(): void {
    this.newsService.getBanners().subscribe(data => {
      this.imageArrayTest = data
      this.imageArray = this.imageArrayTest.map(i => {
        return this.storageUrl + i["url"];
      })
    });
  }

  get f() { return this.productForm.controls };

  drop(event: CdkDragDrop<string[]>)
  {
    moveItemInArray(this.imageArray, event.previousIndex, event.currentIndex);

  }

  uploadBanner(){
    this.submitted = true;
    this.isSave = true;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to save banner?', type: "APPROVED" }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {

        let SubmitImage = []
        this.imageArray.forEach(image =>
        {
          let Image = image.slice(this.storageUrl.length, image.length);
          SubmitImage.push(Image);
        })

        var formBanner = {
          storage_key: SubmitImage,
        }

        this.newsService.uploadBanner(formBanner).subscribe(data =>
        {
          if (data.code == 200)
          {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Banner upload successfully.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
          }
        })
      } else
      {
        dialogRef.close();
      }
    })
  }

  updateBanner()
    {
        this.submitted = true;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'Do you wish to update this product?', type: "APPROVED" }
        });

        dialogRef.afterClosed().subscribe(result =>
        {
            if (result === true)
            {
                let SubmitImage = []
                this.imageArray.forEach(image =>
                {
                    let Image = image.slice(this.storageUrl.length, image.length);
                    SubmitImage.push(Image);
                })
                var formBanner = {
                    storage_key: SubmitImage
                }

                this.newsService.uploadBanner(formBanner).subscribe(data =>
                  {
                    if (data.code == 200)
                    {
                      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                        width: "500px",
                        data: {
                          message:
                            'Banner upload successfully.',
                          title:
                            "NOTIFICATION",
                          colorButton: false
                        },
                      });
                      this.isSave = true
                    }
                  })
            } 
            else
            {
                dialogRef.close();
            }
        })
    }


  notCreateNew()
  {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Your changes will not be saved, do you wish to leave?' }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.router.navigate(['direct-sales/news/all'])
      } else
      {
        dialogRef.close();
      }
    })
  }


  preview(files)
  {
    if (files.length === 0)
      return;
    if(this.imageArray.length >= 5)
    {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
            'You reached maximum 5 photos.',
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      dialogNotifi.afterClosed().subscribe(data =>
      {

      })
      return false;
    }
    if (files[0].size > 4 * 1024 * 1024)
    {
      const dialogNotifi = this.dialog.open(CommonDialogComponent, {
        width: "500px",
        data: {
          message:
            'Maximum File Size 4.00 MB. Please choose another picture',
          title:
            "NOTIFICATION",
          colorButton: false
        },
      });
      dialogNotifi.afterClosed().subscribe(data =>
      {

      })
      return false;
    }
    var reader = new FileReader();
    this.imagePath = files;
    let file = files[0];
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) =>
    {
      let preSignedUrl: string;
      let profilePhotoKey: string;
      this.newsService.getPreSignedUrlBanner(Date.now().toString() + file.name, file.type).subscribe(response =>
      {
        if (response.code === 200)
        {
          profilePhotoKey = response.key;
          preSignedUrl = response.url;
          this.newsService.uploadFiletoS3(preSignedUrl, file.type, file).subscribe(data=>{
            this.imageArray.push(this.storageUrl + profilePhotoKey);
          });
        }
      });

      this.imgURL = reader.result;
      return this.imageArray
   

    }
  }
  onFileDropped($event)
  {
    this.fileBrowseHandler($event);

  }
  /**
  * handle file from browsing
  */
  fileBrowseHandler(files)
  {
    this.preview(files)
    this.prepareFilesList(files);
  }

  changeFile(event) {
    event.srcElement.value = "";
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number)
  {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to do delete this image?' }
    });
    dialogRef.afterClosed().subscribe(result =>
    {
      if (result === true)
      {
        this.files.splice(index, 1);
        this.imageArray.splice(index, 1)
      } else
      {
        dialogRef.close();
      }
    })
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number)
  {
    setTimeout(() =>
    {
      if (index === this.files.length)
      {
        return;
      } else
      {
        const progressInterval = setInterval(() =>
        {
          if (this.files[index].progress === 100)
          {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else
          {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>)
  {
    for (const item of files)
    {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals)
  {
    if (bytes === 0)
    {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}


