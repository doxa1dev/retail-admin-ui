import { ConfirmDialogComponent } from './../../../../_shared/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';
import { ProductService } from 'app/core/service/product.service';
import * as CURRENCY from 'assets/currency.json';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { environment } from 'environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { Product , Properties} from 'app/core/models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { NewsService, News } from 'app/core/service/news.service';
@Component({
    selector: 'app-news-detail',
    templateUrl: './news-detail.component.html',
    styleUrls: ['./add-new.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})


export class NewsDetailComponent implements OnInit
{
    selectedCategory =[];
    storageUrl = environment.storageUrl;
    categories: SelectItem[];
    title: string;
    productForm: FormGroup;
    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    options = [];
    minDateStart: Date = new Date();
    minDateEnd: Date = new Date();
    disable: boolean = true;
    currency = (CURRENCY as any).default;
    selectedCurrency: string;
    text2: string;
    sku: string = "";
    checkShippingWeight: boolean = true;
    checkVariant: boolean = false;
    checkActive: boolean = true;
    hasAvisor: boolean = false;
    hasSpecialPayment: boolean = false;
    files: any[] = [];
    public imagePath;
    imgURL: any;
    imageArray: string[] = [];
    isCreate: boolean = true;
    arrCategories: any = [];
    weightUpdate =0 ;

    propertiesArray: FormGroup;
    property: FormGroup;
    propertiesValueArray: string[][] = [];


    ProductName : string;
    product_public_id : string;
    // productData : Product ;
    productData : News;
    promotionStartTimeData : Date;
    promotionEndTimeData: Date;
    arrayLengthInit : number;
    history = [];
    submitted : boolean = false;
    productWeight : number;
    listPrice: string;
    promotionPrice: string;
    tax: number;
    shippingFee: number;
    currencyPattern = /^[0-9,]+(\.[0-9]{1,2})?$/;
    constructor(
        private _location: Location,
        private _productService: ProductService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        public newsService: NewsService
    )
    {
        this.currency = (CURRENCY as any).default;
    }

    ngOnInit(): void
    {
        this.productForm = this.formBuilder.group({
            productTitle: ['', Validators.required],
            productDescription: [''],
        })
        this.activatedRoute.queryParams.subscribe(params =>{
            this.product_public_id = params.id;
        })
        this.Init()

    }

    get f() { return this.productForm.controls };

    Init(){
        this.newsService.getNewsByUuId(this.product_public_id).subscribe(data =>{
            this.productData = data
            // this.productData = data;
            this.ProductName = this.productData.title;
            // this.listPrice = this.productData.listedPrice;
            // this.promotionPrice = this.productData.promotionalPrice;
            // this.tax = parseInt(this.productData.tax);
            // this.shippingFee =  parseInt(this.productData.shippingFee);
            // this.checkShippingWeight = parseInt(this.productData.weight) !== 0 ? true : false;
            // this.promotionStartTimeData = isNullOrUndefined(this.productData.promotionStartTime) ? null : new Date(this.productData.promotionStartTime);
            // this.promotionEndTimeData = isNullOrUndefined(this.productData.promotionEndTime) ? null : new Date(this.productData.promotionEndTime);
            this.imageArray = this.productData.images;
            // this.arrayLengthInit = this.imageArray.length;
            // this.arrCategories = this.productData.arrCategories;
            // this.selectedCategory = this.productData.arrCategories;
            // this.productWeight = parseInt(this.productData.weight);
            // this.checkVariant = Object.keys(this.productData.properties).length === 0 ? false : true;
            // this.selectedCurrency = this.productData.currencyCode;
            // if(this.checkVariant === true)
            // {
            //     for (const key in this.productData.properties)
            //     {
            //         if (this.productData.properties.hasOwnProperty(key))
            //         {
            //             const element = this.productData.properties[key];
            //             this.addOptionInit(key);
            //             this.propertiesValueArray.push(element);
            //         }
            //     }
            // }


            this.history = this.productData.history;
            // console.log(this.history);

        })
        // this._productService.getAllCategories().subscribe(data =>
        // {
        //     this.categories = data
        // })
        // this.propertiesArray = this.formBuilder.group({
        //     properties: this.formBuilder.array([])
        // })
    }

    //Variant
    // createProperty(): FormGroup
    // {
    //     return this.formBuilder.group({
    //         property_name: ['', Validators.required],
    //         property_option: this.formBuilder.array([]),
    //     })
    // }
    // createPropertyInit(pro: string): FormGroup
    // {
    //     return this.formBuilder.group({
    //         property_name: [pro, Validators.required],
    //         property_option: this.formBuilder.array([]),
    //     })
    // }
    // get properties(): FormArray
    // {
    //     return this.propertiesArray.get('properties') as FormArray;
    // }
    // get property_option(): FormArray
    // {
    //     return this.propertiesArray.get('properties').get('property_option') as FormArray;
    // }
    // addOption()
    // {
    //     (<FormArray>this.propertiesArray.get('properties')).push(this.createProperty())
    //     this.propertiesValueArray.push([]);
    // }
    // addOptionInit(input : string)
    // {
    //     (<FormArray>this.propertiesArray.get('properties')).push(this.createPropertyInit(input))
    // }
    // removeOption(index: number)
    // {
    //     this.properties.removeAt(index);
    //     this.propertiesValueArray.splice(index, 1);
    // }
    add(event: MatChipInputEvent, index: number)
    {
        const input = event.input;
        const value = event.value;
        if ((value || '').trim())
        {
            this.propertiesValueArray[index].push(value.trim());
        }
        if (input)
        {
            input.value = '';
        }
    }

    remove(option, i: number): void
    {
        const optIndex = this.propertiesValueArray[i].indexOf(option);
        if (optIndex >= 0)
        {
            this.propertiesValueArray[i].splice(optIndex, 1);
        }
    }

    //End Variants

    drop(event: CdkDragDrop<string[]>)
    {
        if(event.currentIndex != 0 )
        {
            return;
        }
        moveItemInArray(this.imageArray, event.previousIndex, event.currentIndex);

        let SubmitImage = []
        this.imageArray.forEach(image =>
        {
            let Image = image.slice(this.storageUrl.length, image.length);
            SubmitImage.push(Image);
        })
        var formAttach = {
            storage_key: SubmitImage
        }
        return this.newsService.updateNewsAttachMent(this.product_public_id, formAttach).subscribe(data=>{
            return this.imageArray;
        })
    }

    back()
    {
        this._location.back();
    }

    updateProduct()
    {
        this.submitted = true;
        if (this.productForm.invalid || this.imageArray.length == 0)
        {
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: { message: 'Do you wish to update this product?', type: "APPROVED" }
        });

        dialogRef.afterClosed().subscribe(result =>
        {
            if (result === true)
            {
                // let option = new Object;
                // this.propertiesArray.value.properties.forEach((property, index) =>
                // {
                //     option[property.property_name] = this.propertiesValueArray[index]
                // })
                let SubmitImage = []
                this.imageArray.forEach(image =>
                {
                    let Image = image.slice(this.storageUrl.length, image.length);
                    SubmitImage.push(Image);
                })
                var formProduct = {
                    title: this.productForm.value.productTitle,
                    description: this.productForm.value.productDescription,
                    storage_key: SubmitImage
                    // product_uri: Date.now().toString(),
                    // // is_active: this.productData.isActive,
                    // product_name: this.productForm.value.productTitle,
                    // product_description: this.productForm.value.productDescription,
                    // sku: this.sku,
                    // categories: this.selectedCategory,
                    // listed_price: parseFloat(this.productForm.value.listedPrice.replace(',','')),
                    // promotional_price: (isNullOrUndefined(this.productForm.value.promotionPrice) || this.productForm.value.promotionPrice === '') ? null : parseFloat(this.productForm.value.promotionPrice.replace(',', '')),
                    // promotion_start_time: isNullOrUndefined(this.productForm.value.promotionStartDay) ? null : new Date(this.productForm.value.promotionStartDay),
                    // promotion_end_time: isNullOrUndefined(this.productForm.value.promotionEndDay) ? null : new Date(this.productForm.value.promotionEndDay),
                    // currency_code: this.selectedCurrency,
                    // // has_advisor: this.productData.hasAdvisor,
                    // terms_and_conditions_link: this.productForm.value.termsAndConditionsLink,
                    // max_order_number: this.productForm.value.orderNumber,
                    // has_special_payment: this.hasSpecialPayment,
                    // tax: (isNullOrUndefined(this.productForm.value.tax) || this.productForm.value.tax === '') ? 0 : parseFloat(this.productForm.value.tax),
                    // shipping_fee: (isNullOrUndefined(this.productForm.value.shippingFee) || this.productForm.value.shippingFee === '') ? 0 : parseFloat(this.productForm.value.shippingFee.replace(',', '')),
                    // storage_key: SubmitImage,
                    // properties: option,
                    // allow_epp_payment: false,
                    // allow_recurring_payment: false,
                    // product_weight: (isNullOrUndefined(this.productForm.value.weight) || this.productForm.value.weight === '') ? 0 : parseInt(this.productForm.value.weight),
                    // is_deleted: false,
                    // need_unbox: false,
                    // need_host: false
                }
                // console.log(this.productData.hasAdvisor)
                this.newsService.updateNewsByUuId(this.product_public_id, formProduct).subscribe(data =>
                {
                    if (data.code === 200)
                    {
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                            width: "500px",
                            data: {
                                message:
                                    'Update News Success.',
                                title:
                                    "NOTIFICATION",
                                colorButton: false
                            },
                        });
                        dialogNotifi.afterClosed().subscribe(data =>
                        {
                            this.Init();
                            this.router.navigate(['direct-sales/news/all']);
                        })
                    }

                })
            } else
            {
                dialogRef.close();
            }
        })
    }
    deleteNews(){
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            width: '500px',
            data: { message: 'Do you wish to delete this product?' }
        });
        dialogRef.afterClosed().subscribe(result =>
        {
            if (result === true)
            {
                this.newsService.deleteNewsByUuId(this.product_public_id).subscribe(data=>{

                    if (data.code === 200)
                    {
                        const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                            width: "500px",
                            data: {
                                message:
                                    'Delete News Success.',
                                title:
                                    "NOTIFICATION",
                                colorButton: false
                            },
                        });
                        dialogNotifi.afterClosed().subscribe(data =>
                        {
                            this.router.navigate(['direct-sales/news/all'])
                        })
                    }
                })
            } else
            {
                dialogRef.close();
            }
        })
    }
    // notUpdateProduct()
    // {
    //     const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
    //         width: '500px',
    //         data: { message: 'Do you wish to do not update this product?' }
    //     });
    //     dialogRef.afterClosed().subscribe(result =>
    //     {
    //         if (result === true)
    //         {
    //             this.router.navigate(['direct-sales/products/all'])
    //         } else
    //         {
    //             dialogRef.close();
    //         }
    //     })
    // }
    // onChangeStart(event)
    // {
    //     this.minDateEnd = event;
    //     this.disable = false;
    // }



    preview(files)
    {
        if (files.length === 0)
            return;

        if (this.imageArray.length >= 6)
        {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                    message:
                        'Maximum pictures  is 6',
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
            this.newsService.getPreSignedUrl(Date.now().toString() + file.name, file.type).subscribe(response =>
            {
                if (response.code === 200)
                {
                    profilePhotoKey = response.key;
                    preSignedUrl = response.url;
                    this.newsService.uploadFiletoS3(preSignedUrl, file.type, file).subscribe(data =>
                    {
                        this.imageArray.push(this.storageUrl + profilePhotoKey);
                        let formImage
                        if(this.imageArray.length === 1){
                            formImage = {
                                uuid: this.product_public_id,
                                storage_key: profilePhotoKey,
                                is_cover_photo: true
                            }
                        }else{
                            formImage = {
                                uuid: this.product_public_id,
                                storage_key: profilePhotoKey,
                                is_cover_photo: false
                            }
                        }


                        this.newsService.updateNewsImage(formImage).subscribe(response =>
                        {
                            if (response.code == 200)
                            {
                                // console.log("Update success")
                                // console.log(response.data)
                            } else
                            {
                                // console.log("Update error")
                            }
                        })

                    });
                }
            });

            this.imgURL = reader.result;
            // console.log(this.imageArray);
            return this.imageArray
        }
    }
    onFileDropped($event)
    {
        this.prepareFilesList($event);

    }
    /**
    * handle file from browsing
    */
    fileBrowseHandler(files)
    {
        this.preview(files)
        this.prepareFilesList(files);
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
                this.imageArray.splice(index, 1);
                let SubmitImage = []
                this.imageArray.forEach(image =>
                {
                    let Image = image.slice(this.storageUrl.length, image.length);
                    SubmitImage.push(Image);
                })
                return this.newsService.updateNewsAttachMent(this.product_public_id, { storage_key: SubmitImage }).subscribe(data =>
                {
                })
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


