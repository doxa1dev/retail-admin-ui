import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { CategoryService } from 'app/core/service/category.service';
import { Category } from 'app/core/models/category.model';
import { Location } from '@angular/common';
import { environment } from 'environments/environment'
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { TranslationService } from 'app/core/service/translation.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {


  /** Category form */
  formCategory: FormGroup;
  /** id */
  categoryId: number;
  /** mode Edit */
  modeEdit: boolean;
  /** category */
  category: Category;

  category_edit: Category;
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

  submitted: boolean = false;

  listLanguage: string[];

  constructor(
    private formBuilder: FormBuilder,
    private router : ActivatedRoute,
    private categoryService: CategoryService,
    private location: Location,
    private navigate: Router,
    public dialog: MatDialog,
    private translationService: TranslationService
  ) {
    this.category = new Category()
  }

  ngOnInit(): void {
    this.router.queryParams.subscribe(params=>{
      this.categoryId = params.id
    })
    if (!isNullOrUndefined(this.categoryId)){
      this.modeEdit = true;
      this.categoryService.getCategorybyId(this.categoryId).subscribe(
        respone => {
          this.category = respone
          this.photoKey = this.category.categoryPhotoKey
          this.url = this.storageUrl + this.photoKey
      });
      this.categoryService.getCategoryHistory(this.categoryId).subscribe(
        respone => {
          this.arrCategoryHistory = respone
        }
      )
      // get translation of category
      this.translationService.getListTranslationByCategoryId(this.categoryId).subscribe(data => {
        let rowData: any[] = [];
        data.forEach(element => {
          rowData.push(element.language);
        })
        this.listLanguage = rowData;
      });
    }
    //Form group
    this.formCategory = this.formBuilder.group({
      categoryTitle: ['', Validators.required],
      categoryDescription: ['', Validators.required],
      categoryImage: [''],
      categoryIsActive: [false]
    })
  }

  onFileDropped(event){
    let files = event
    this.checkAndUpload(files)
  }

  /**
   * on Select File
   * @param event
   */
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      let files = event.target.files
      this.checkAndUpload(files)
    }
  }

  checkAndUpload(files){
    if (files && files[0]) {
      if ( files[0].size > 4 * 1024 * 1024){
      this.url = "";
      this.checkValidateFile = true;
              // console.log(files[0].size);
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
      dialogNotifi.afterClosed().subscribe(data => {

      });
      return false;
      } else {
        const file = files[0]
        this.checkValidateFile = false
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (event:any) => {
            // this.url = event.target.result;
            this.categoryService.getUrlImage(Date.now().toString()+ file.name, file.type).subscribe(
              respone => {
                if (respone.code === 200){
                  var signUrl = respone.url
                  var photoKey = respone.key
                  //upload file to S3
                  this.categoryService.uploadFiletoS3(signUrl, file.type, file).subscribe(
                    data => {
                      this.url = this.storageUrl + photoKey
                      this.photoKey = photoKey
                        if(this.modeEdit){
                          var updateCategoryObject = {
                            id: this.categoryId,
                            entity_id: this.category.entityId,
                            public_id: this.category.publicId,
                            category_photo_key: this.photoKey,
                            is_active: this.category.isActive,
                            category_name: this.category.categoryName,
                            category_description: this.category.categoryDescription
                          }
                          this.categoryService.updateCategory(updateCategoryObject).subscribe(response => {
                            if(response.code === 200){
                          }})
                        }
                      }
                  )
                }
              }
            )
        }
      }
    }
  }

  SaveOrUpdateCategory(){
    this.submitted = true;
    if (this.formCategory.invalid )
    {
      return;
    }
    let categoryName =  this.formCategory.value.categoryTitle
    let categoryDescription = this.formCategory.value.categoryDescription
    let categoryIsActive = this.formCategory.value.categoryIsActive
    // console.log(this.formCategory.value)
    if(this.modeEdit){
      var updateCategoryObject = {
        id: this.categoryId,
        entity_id: this.category.entityId,
        public_id: this.category.publicId,
        category_photo_key: this.photoKey,
        is_active: isNullOrUndefined(categoryIsActive) ? false: categoryIsActive,
        category_name: categoryName,
        category_description: categoryDescription
      }
      // console.log(updateCategoryObject);
      // const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      //   width: '500px',
      //   data: { message: 'Do you wish to update the category?' }
      // });
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: { message: 'Do you wish to update the category?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true){

          this.categoryService.updateCategory(updateCategoryObject).subscribe(response => {
            if(response.code === 200){
              this.modeChange = false;
              // console.log(response);
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Category update successfully.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
                {
                  this.navigate.navigate(['direct-sales/products/categories'])
                })
               // get again category history
              this.categoryService.getCategoryHistory(this.categoryId).subscribe(
                respone => {
                  this.arrCategoryHistory = respone
                }
              )
            }
          })
        }})
    } else {
      let createCategoryObject = {
        entity_id: 1,
        public_id: this.category.publicId,
        category_photo_key: this.photoKey,
        is_active: isNullOrUndefined(categoryIsActive) ? false: categoryIsActive,
        category_name: categoryName,
        category_description: categoryDescription
      }
      // console.log(createCategoryObject);
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {message: 'Do you wish to create the category?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true){
          // Create category api
          this.categoryService.createCategory(createCategoryObject).subscribe(response => {
            // console.log(response);
            if(response.code === 200){
              this.modeEdit = true
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Category created successfully.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data =>
              {
                this.navigate.navigate(['direct-sales/products/categories'])
              })
            }
          })
        }})
    }
  }

  // translation
  translate() {
    this.navigate.navigate(['direct-sales/products/translation'], { queryParams: { id: this.categoryId, type:'category'} });
  }

  back(){
    this.location.back();
  }

  deleteCategory(){
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to do delete this category?' }
    });
    dialogRef.afterClosed().subscribe(result =>{
      if (result === true){
        this.categoryService.deleteCategory(this.categoryId).subscribe(response => {
          if(response.code === 200){
            this.navigate.navigate(['/direct-sales/products/categories']);
          }
        })
      }})
  }

  /**
   * Change data
   */
  changeUpdate(){
    this.modeChange = true
  }


  // add(event: MatChipInputEvent): void
  // {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our fruit
  //   if ((value || '').trim())
  //   {
  //     this.fruits.push({ name: value.trim() });
  //   }

  //   // Reset the input value
  //   if (input)
  //   {
  //     input.value = '';
  //   }
  // }

  // remove(fruit): void
  // {
  //   const index = this.fruits.indexOf(fruit);

  //   if (index >= 0)
  //   {
  //     this.fruits.splice(index, 1);
  //   }
  // }


}
