import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NewNaepService } from 'app/core/service/new-naep.service';
import { ReportsService } from 'app/core/service/reports.service';
import { Kit, NaepPackagesCreateForm } from 'app/core/models/naep.model';
import { CheckNullOrUndefined, CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { CategoryService } from 'app/core/service/category.service';
import { environment } from 'environments/environment';
@Component({
  selector: 'app-create-naep-packages',
  templateUrl: './create-naep-packages.component.html',
  styleUrls: ['./create-naep-packages.component.scss']
})
export class CreateNaepPackagesComponent implements OnInit {

  uuid: string;
  mode: string;
  updateHistory=[];
  periodLength
  packagesName: string;
  selectedProcess ;
  selectedNaepType=[];
  selectedNaepFee ;
  selectedPayback ;
  listProduct = [];
  listProductDeposit = [];
  submited: boolean = false;
  listNaepType = []
  listNaepProcess=[]
  selectedDeposit=[];
  haveDepositProduct: boolean = false;

  selectesAdvisorFee=[];
  haveAdvisorFee: boolean = false;

  checked: boolean = false;
  is_active: boolean = false;
  activeTitle: string = "Inactive";
  kitName: string;
  kitSKU: string;
  hasGracePeriod: boolean = false;
  number_grace_period: number = 1;
  constructor(
    private location : Location,
    public dialog: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute : ActivatedRoute,
    private newNaepService: NewNaepService,
    private reportsService: ReportsService,
    private categoryService: CategoryService
  ) { }

  formNaepPackagesProduct: FormGroup;
  url: any;
  checkValidateFile: boolean = false;
  modeChange: boolean = false;
  storageUrl = environment.storageUrl;
  photoKey: string;

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.uuid = params.uuid;
      this.checkMode(this.uuid)
    });

    this.formNaepPackagesProduct = this.formBuilder.group({
      packageName: ['', Validators.required],
      description: ['', Validators.required]
      // formDepositProduct: this.formBuilder.array([
      //   this.formBuilder.group({
      //     depositProduct: ['']
      //   })
      // ]),
      // formKitProduct: this.formBuilder.array([
      //   this.formBuilder.group({
      //     kitProduct: []
      //   })
      // ]),
    });

    this.newNaepService.getAllDepositProduct().subscribe(data=>{
      this.listProductDeposit = data
    })


    if(this.mode === 'UPDATE'){
      this.newNaepService.getNaepPackageDetail(this.uuid).subscribe(data=>{

        if(!CheckNullOrUndefinedOrEmpty(data)){
          this.selectedNaepType = data.naep_type;
          this.selectedProcess = data.naep_process;
          this.selectedNaepFee = data.naep_fee;
          this.selectedPayback = data.naep_paypack;
          this.packagesName = data.name;
          if (!CheckNullOrUndefinedOrEmpty(data.avatar)) {
            this.url = this.storageUrl + data.avatar;
            this.photoKey = data.avatar;
          }
          this.is_active = data.is_active;
          this.hasGracePeriod = data.has_grace_period;
          if(data.has_grace_period){
            this.number_grace_period = data.grace_period_days;
          }
          if(this.is_active){
            this.activeTitle = "Active"
          }else{
            this.activeTitle = "Inactive"
          }
          this.formNaepPackagesProduct.patchValue({
            packageName: data.name,
            description: data.description
          })
          if(data.naep_deposit_product.length > 0){
            this.haveDepositProduct = true;
            this.selectedDeposit = data.naep_deposit_product;
          }
          this.updateHistory = this.newNaepService.renderHistory(data.history)

        }
      });

      this.newNaepService.getNaepAdvisorKit(this.uuid).subscribe(data=>{
          if(!CheckNullOrUndefinedOrEmpty(data) && !CheckNullOrUndefinedOrEmpty(data.advisorData)){
            // this.haveAdvisorFee = true;
            this.kitSKU = data.sku;
            this.kitName = data.name;
            this.selectesAdvisorFee = data.advisorData;
          }
      })
    }

    this.newNaepService.getListNaepTypeForPackages().subscribe(data=>{
      this.listNaepType = data;
    });
    this.newNaepService.getListNaepProcessForPackages().subscribe(data=>{
      this.listNaepProcess = data;
    });

    this.reportsService.getListProduct().subscribe(data=>{
      this.listProduct = data;
    })

  }

  checkMode(data){
    if(CheckNullOrUndefined(data)){
      this.mode = "CREATE";
    }else{
      this.mode = "UPDATE"
    }
  }

  get f() { return this.formNaepPackagesProduct.controls };

  back(){
    this.location.back();
  }

  createNAEPPackages(){
    this.submited = true;
    if(this.selectedNaepType.length == 0 || CheckNullOrUndefinedOrEmpty(this.selectedProcess) || this.selectedNaepFee.length == 0
        || this.selectedPayback.length == 0
        || this.formNaepPackagesProduct.invalid
        || (this.haveDepositProduct && this.selectedDeposit.length == 0)
        || (this.selectesAdvisorFee.length == 0
        || CheckNullOrUndefinedOrEmpty(this.kitName)
        || CheckNullOrUndefinedOrEmpty(this.kitSKU))
        || CheckNullOrUndefinedOrEmpty(this.url)

      ){
      return;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to create this NAEP packages?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let createPackage = new NaepPackagesCreateForm();
          createPackage.is_active = this.is_active;
          createPackage.name = this.formNaepPackagesProduct.value.packageName;
          createPackage.description = this.formNaepPackagesProduct.value.description;
          createPackage.has_grace_period = this.hasGracePeriod;
          if(this.hasGracePeriod){
            createPackage.grace_period_days = this.number_grace_period;
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedNaepType)){
            this.selectedNaepType.forEach(type=>{
              createPackage.naep_type.push(Number(type.id))
            })
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedProcess)){
            createPackage.naep_process = Number(this.selectedProcess.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedNaepFee)){
              createPackage.naep_fee=Number(this.selectedNaepFee.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedPayback)) {
            createPackage.naep_paypack = Number(this.selectedPayback.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedDeposit)){
            this.selectedDeposit.forEach(deposit=>{
              createPackage.naep_deposit_product.push(Number(deposit.id))
            })
          }
          if (!CheckNullOrUndefinedOrEmpty(this.photoKey)) {
            createPackage.package_avatar = this.photoKey;
          }

          let kit = new Kit();
          kit.name = this.kitName;
          kit.sku = this.kitSKU;
          this.selectesAdvisorFee.forEach(kitItem=>{
            kit.advisor_kit.push(Number(kitItem.id))
          })
          createPackage.advisorKit = kit;

          this.newNaepService.createNaepPackages(createPackage).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Create NAEP Package Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/configuration/naep-packages']);
              });
            }else if(data.code === 202){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'SKU has already exists.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            }
            else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Create NAEP Package.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            }
          })
        }else {
          dialogRef.close();
        }
      })

    }
  }

  addNaepDepositProduct(){
    this.haveDepositProduct = !this.haveDepositProduct;
    if(!this.haveDepositProduct){
      this.selectedDeposit = []
    }
  }

  addNaepAdvisorKit(){
    this.haveAdvisorFee = !this.haveAdvisorFee;
    if(!this.haveAdvisorFee){
      this.selectesAdvisorFee = [];
      this.kitName="";
      this.kitSKU = "";
    }
  }

  addOrRemoveNaepDepositProduct(action: string, index: number) {
    const newForm = this.formBuilder.group({
      depositProduct: []
    })

    const form = this.formNaepPackagesProduct['controls'].formDepositProduct as FormArray
    if (action === 'add') {
      form.push(newForm);
    }
    else {
      if (form.length === 1) {
        return;
      }
      form.removeAt(index);
    }
  }

  addOrRemoveNaepKitProduct(action: string, index: number) {
    const newForm = this.formBuilder.group({
      kitProduct: []
    })

    const form = this.formNaepPackagesProduct['controls'].formKitProduct as FormArray
    if (action === 'add') {
      form.push(newForm);
    }
    else {
      if (form.length === 1) {
        return;
      }
      form.removeAt(index);
    }
  }

  changeNaepType(){
    // console.log(this.selectedNaepType)
  }

  changeNaepFee(event){
    // console.log(this.selectedProcess)

  }

  changeNaepDeposit(event){
    // console.log(this.selectedDeposit)
  }

  deleteNAEP(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '700px',
      data: { message: 'Are you sure you want to delete this NAEP package?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.newNaepService.deleteNaepPackage(this.uuid).subscribe(data=>{
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Delete NAEP Package Success.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(() => {
              this.router.navigate(['direct-sales/configuration/naep-packages']);
            });
          }else{
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "600px",
              data: {
                message:
                  'Error When Delete NAEP Package.',
                title:
                  "NOTIFICATION",
                colorButton: true
              },
            });
          }
        })
      }else {
        dialogRef.close();
      }
    })

  }

  updateNAEP(){
    this.submited = true;
    if(this.selectedNaepType.length == 0 || CheckNullOrUndefinedOrEmpty(this.selectedProcess) || this.selectedNaepFee.length == 0
        || this.selectedPayback.length == 0
        || this.formNaepPackagesProduct.invalid
        || (this.haveDepositProduct && this.selectedDeposit.length == 0)
        || (this.selectesAdvisorFee.length == 0 || CheckNullOrUndefinedOrEmpty(this.kitName)
        || CheckNullOrUndefinedOrEmpty(this.kitSKU))
        || CheckNullOrUndefinedOrEmpty(this.url)

      ){
      return;
    }else{
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '700px',
        data: { message: 'Are you sure you want to update this NAEP packages?', type: "APPROVED" }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let createPackage = new NaepPackagesCreateForm();
          createPackage.name = this.formNaepPackagesProduct.value.packageName;
          createPackage.description = this.formNaepPackagesProduct.value.description;
          createPackage.is_active = this.is_active;
          if(this.hasGracePeriod){
            createPackage.grace_period_days = this.number_grace_period;
          }else{
            createPackage.grace_period_days = null;
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedNaepType)){
            this.selectedNaepType.forEach(type=>{
              createPackage.naep_type.push(Number(type.id))
            })
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedProcess)){
            createPackage.naep_process = Number(this.selectedProcess.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedNaepFee)){
            createPackage.naep_fee=Number(this.selectedNaepFee.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedPayback)) {
            createPackage.naep_paypack = Number(this.selectedPayback.value.id)
          }
          if(!CheckNullOrUndefinedOrEmpty(this.selectedDeposit)){
            this.selectedDeposit.forEach(deposit=>{
              createPackage.naep_deposit_product.push(Number(deposit.id))
            })
          }
          if (!CheckNullOrUndefinedOrEmpty(this.photoKey)) {
            createPackage.package_avatar = this.photoKey;
          }

          let kit = new Kit();
          kit.name = this.kitName;
          kit.sku = this.kitSKU;
          this.selectesAdvisorFee.forEach(kitItem=>{
            kit.advisor_kit.push(Number(kitItem.id))
          })
          createPackage.advisorKit = kit;

          this.newNaepService.updateNaepPackage(createPackage, this.uuid).subscribe(data=>{
            if(data.code === 200){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Update NAEP Package Success.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(() => {
                this.router.navigate(['direct-sales/configuration/naep-packages']);
              });

            }else if(data.code === 202){
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'SKU has already exists.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            }
            else{
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "600px",
                data: {
                  message:
                    'Error When Update NAEP Package.',
                  title:
                    "NOTIFICATION",
                  colorButton: true
                },
              });
            }
          })
        }else {
          dialogRef.close();
        }
      })
    }
  }

  checkActive(event){
    if(event.checked){
      this.activeTitle = "Active"
    }else{
      this.activeTitle = "Inactive"
    }
  }

  onFileDropped(event){
    let files = event
    this.checkAndUpload(files)
  }

  checkAndUpload(files){
    if (files && files[0]) {
      if ( files[0].size > 4 * 1024 * 1024){
      this.url = "";
      this.checkValidateFile = true;

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
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (event:any) => {
            // this.url = event.target.result;
            this.newNaepService.getUrlImageNaepPackage(Date.now().toString()+ file.name, file.type).subscribe(
              respone => {
                if (respone.code === 200){
                  const signUrl = respone.url
                  const photoKey = respone.key
                  // upload file to S3
                  this.categoryService.uploadFiletoS3(signUrl, file.type, file).subscribe(
                    data => {
                      this.url = this.storageUrl + photoKey
                      this.photoKey = photoKey
                      }
                  )
                }
              }
            )
        }
      }
    }
  }

  changeUpdate(){
    this.modeChange = true
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      let files = event.target.files
      this.checkAndUpload(files)
    }
  }
}
