import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined, isNumber } from 'util';
import { CategoryService } from 'app/core/service/category.service';
import { Category } from 'app/core/models/category.model';
import { Location } from '@angular/common';
import { environment } from 'environments/environment'
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import * as $ from 'jquery';
import { InventoryService, TypeMultiSelect } from 'app/core/service/inventory.service';

@Component({
  selector: 'app-create-stock',
  templateUrl: './create-stock.component.html',
  styleUrls: ['./create-stock.component.scss']
})
export class CreateStockComponent implements OnInit {


  formCreateStockCard: FormGroup;
  /** id */
  categoryId: number;
  /** mode Edit */
  modeEdit: boolean;
  /** category */
  category: Category;
  /** image Url */
  imageUrl: string;
  /** check Validate File */
  checkValidateFile: boolean = false;
  /** Photo key */
  photoKey: string;
  /** storage url  */
  storageUrl = environment.storageUrl
  /** Array category history */
  arrCategoryHistory = []
  /** url image */
  url: any;
  /** change update */
  modeChange: boolean;
  /** array Product */
  arrayProduct = []
  /** index Product */
  indexProduct = 1
  /** array Document */
  arrayDocument:  number[] = []
  /** index Product */
  indexDocument = 1
  /** list Inventory */
  listInventory = []
  listtypeMultiSelect = []
  listViewInventory = []
  arrayProductCopy = []
  arrayStorageKey = []

  typeStockCard = [];
  selectedStockCard;
  commentStockCard;

  Search = "Search"
  minDate: Date = new Date();
  dateSelected: Date = new Date;
  submitted: boolean = false;

  fileToUpload: File = null;
  fileName: string = '';

  currentStock: number = 30;
  minStock: number = 15;
  checkCurrentStock = false
  constructor(
    private formBuilder: FormBuilder,
    private router : ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    public inventoryService: InventoryService,
    private routerNavigate: Router,
  ) {
    this.category = new Category();
    this.typeStockCard = [
      {label:"IN",value:{id:1, name:"IN"}},
      {label:"OUT",value:{id:2, name:"OUT"}}
    ]
  }

  ngOnInit(): void {
    this.arrayDocument.push(this.indexDocument)
    this.router.queryParams.subscribe(params=>{
      this.categoryId = params.id
    })

    this.addOption()
    //Form group
    this.formCreateStockCard = this.formBuilder.group({
      stockCardType: ['', Validators.required],
      stockCardComment: [''],
      stockCardDate: ['', Validators.required],
    })
    this.getListProductInventory()
  }

  get f() { return this.formCreateStockCard.controls };

  getListProductInventory(){
    this.inventoryService.getProductInventory().subscribe( data => {
      this.listtypeMultiSelect = data.listtypeMultiSelect
      this.listInventory = data.listInventory
    })
  }

  changeData(event, i){
    this.checkCurrentStock = false
    let data = event.value
    let check = true
    this.arrayProductCopy[i].quantity = ''
    this.arrayProductCopy.forEach(element => {
      if(element.id == data.id){
        check = false
      }
    });
    if(check){
      this.arrayProductCopy[i] = event.value
      this.arrayProductCopy[i].checkProduct = false
    } else {
      this.arrayProductCopy[i].checkProduct = true
    }
  }

  /** add Option */
  addOption(){
    let typeMultiSelect = new TypeMultiSelect()
    this.arrayProduct.push(typeMultiSelect)
    this.arrayProductCopy.push(typeMultiSelect)
  }

  /**  */
  addMoreFile(){
    this.indexDocument ++
    this.arrayDocument.push(this.indexDocument)
  }

  /** delete Product */
  deleteProduct(item, i){
    this.arrayProduct.splice(i, 1)
    this.arrayProductCopy.splice(i, 1)
  }

  /** deleteDocument */
  deleteDocument(item, i){
    this.arrayDocument = this.arrayDocument.filter( data => item !== data)
    this.arrayStorageKey.splice(i, 1)
  }

  /** change Quantity*/
  changeQuantity(i, data){
    this.arrayProductCopy[i].quantity = data
    let numbers = new RegExp(/^[0-9]+$/);
    this.arrayProductCopy[i].checkValidateQuantity = false
    this.arrayProductCopy[i].checkGowingUp = false
    if(numbers.test(data)){
      if (this.selectedStockCard.name === 'OUT'){
        if (Number(this.arrayProductCopy[i].quantity) > Number(this.arrayProductCopy[i].currentStock)){
          this.arrayProductCopy[i].checkValidateQuantity = true
        } else {
          this.arrayProductCopy[i].checkValidateQuantity = false
          let balance = Number(this.arrayProductCopy[i].currentStock) - Number(this.arrayProductCopy[i].quantity)
          if(balance >= 0 && balance < Number(this.arrayProductCopy[i].minStock)){
            this.arrayProductCopy[i].checkGowingUp = true
          }
        }
      }
    }  else {
      this.arrayProductCopy[i].checkValidateQuantity = true
    }
  }

  /** create Stock Card */
  createStockCard(){
    this.submitted = true;
    let checkProduct = this.checkValidateFormProduct()
    // var checkAttach = this.checkValidateFormImage()
    if (this.formCreateStockCard.invalid || checkProduct)
    {
      return;
    }
    // set data form activity
    let inventoryStockCardItem: FormDataInventory[] = []
    this.arrayProductCopy.forEach(element => {
      let formDataInventory = new FormDataInventory()
      formDataInventory.in_out_type = this.selectedStockCard.name
      formDataInventory.moving_quantity = element.quantity
      formDataInventory.product_id = element.id
      formDataInventory.stock_quantity = element.currentStock
      if (this.selectedStockCard.name === 'IN'){
        formDataInventory.balance = Number(element.currentStock) + Number(element.quantity)
      } else if (this.selectedStockCard.name === 'OUT'){
        formDataInventory.balance = + Number(element.currentStock) - Number(element.quantity)
      }
      if(formDataInventory.in_out_type === 'OUT' && isNullOrUndefined(element.currentStock)){
        this.checkCurrentStock = true
        return;
      }
      inventoryStockCardItem.push(formDataInventory)
    });

    let formData = {
      comment: this.commentStockCard,
      in_out_date : this.dateSelected,
      inventory_stock_card_item: inventoryStockCardItem,
      inventory_stock_card_attachment: this.arrayStorageKey
    }
    if(!this.checkCurrentStock){
      this.inventoryService.createInventory(formData).subscribe(data => {
        if (data.code === 200){
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
                'Stock card created successfully.',
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          dialogNotifi.afterClosed().subscribe(data =>
          {
            this.routerNavigate.navigate(['direct-sales/products/inventory'])
          })
        }
      })
    }
  }

  back(){
    this.location.back();
  }

  onChangeDate(event){

  }

  checkDisable(){
    if(this.indexDocument >= 6){
      return true
    } else {
      return false
    }
  }

  checkValidateFormProduct(){
    let check = false
    for (let index = 0; index < this.arrayProduct.length; index++) {
      if ( this.formCreateStockCard.value.stockCardType.name === 'OUT' &&
        Number(this.arrayProductCopy[index].quantity) > Number(this.arrayProductCopy[index].currentStock)){
        this.arrayProductCopy[index].checkValidateQuantity = true
      } else {
        this.arrayProductCopy[index].checkValidateQuantity = false
      }
      const element = this.arrayProductCopy[index];
      if(element.id === undefined || element.checkProduct == true
        || element.quantity === undefined || element.checkValidateQuantity == true){
          check = true
          break
      } else {
        check = false
      }
    }
    return check
  }

  checkValidateFormImage(){
    for (let index = 0; index < this.arrayDocument.length; index++) {
      const element = this.arrayStorageKey[index];
      if(element === undefined){
        return true
      } else {
        return false
      }
    }
  }

  onSelectFile(event, i) {
    if (event.target.files && event.target.files[0]) {
      if ( event.target.files[0].size > 4 * 1024 * 1024){
        this.url = "";
        this.checkValidateFile = true;
        return false
      } else {
        const file = event.target.files[0]
        let id = 'image' + i
        let dataDocument = document.getElementById(id)
        dataDocument.innerText = file.name
        this.checkValidateFile = false
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event:any) => {
            this.url = event.target.result;
            this.inventoryService.getUrlImage(Date.now().toString()+ file.name, file.type).subscribe(
              respone => {
                if (respone.code === 200){
                  let signUrl = respone.url
                  let photoKey = respone.key
                  //upload file to S3
                  this.inventoryService.uploadFiletoS3(signUrl, file.type, file).subscribe(
                    data => {
                      this.arrayStorageKey.push(photoKey)
                    }
                  )
                }
              }
            )
        }
      }
    }
  }


}

export class FormDataInventory{
  product_id: any
  in_out_type: string;
  moving_quantity: number;
  stock_quantity : number;
  balance: number;
}
