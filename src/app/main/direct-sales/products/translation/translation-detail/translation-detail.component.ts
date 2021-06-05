import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SelectItem} from 'primeng/api';
import { TranslationService } from 'app/core/service/translation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { ConfirmDialogComponent } from 'app/main/_shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';
import { LanguageEnum } from 'app/core/models/translation.model';
@Component({
  selector: 'app-translation-detail',
  templateUrl: './translation-detail.component.html',
  styleUrls: ['./translation-detail.component.scss']
})
export class TranslationDetailComponent implements OnInit {

  type: string;
  product_id: number;
  category_id: number;
  translation_id: number;
  title: string;
  description: string;
  language_id: number;
  translate_title: string;
  translate_description: string;
  isExist: boolean = false;
  languageUpdateId: number;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private translationService: TranslationService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog
  ) {

    this.activatedRoute.queryParams.subscribe(param => {
      this.type = param.type;
      this.translation_id = param.translationId;
      if (this.type === 'product') {
        this.product_id = param.productId;
        
      } else {
        this.category_id = param.categoryId;
      }
    })

    this.listLanguage=[
      // {
      //   label: 'English',
      //   value: 1
      // },
      {
        label: 'Chinese',
        value: 2
      },
      {
        label: 'Malay',
        value: 3
      }
    ]
  }

  /** Translation form */
  formTranslation: FormGroup;
  /** Translation selected language */
  selectedLanguage = 1;
  /** Translation list language */
  listLanguage : SelectItem[];

  listTranslation: any[] = [];

  ngOnInit(): void {
    this.formTranslation = this.formBuilder.group({
      translationTitle: ['', Validators.required],
      translationDescription: ['', Validators.required]
      // language:['English', Validators.required]
    })

    this.initView();
    
  }

  initView() {
    if (this.type === 'product') {
      // get translation update
      this.translationService._getTranslationProductByTranslationId(this.translation_id).subscribe(data => {
        this.product_id = data.productId;
        if (data.language === 'English') {
          this.selectedLanguage = 1;
          this.language_id = LanguageEnum.ENGLISH_ID;
        }
        else if (data.language === 'Chinese') {
          this.selectedLanguage = 2;
          this.language_id = LanguageEnum.CHINESE_ID;
        }
        else {
          this.selectedLanguage = 3;
          this.language_id = LanguageEnum.MALAY_ID;
        }
        this.languageUpdateId = this.language_id;
        this.translate_title = data.title;
        this.translate_description = data.description;
      });
      // get default English
      this.translationService.getListTranslationByProductId(this.product_id).subscribe(data => {
        if (!isNullOrUndefined(data)) {
          data.forEach(element => {
            if (element.language === "English") {
              this.title = element.title;
              this.description = element.description;
            }
            else if (element.language === "Chinese") {
              this.listTranslation.push(LanguageEnum.CHINESE_ID);
            }
            else if (element.language === "Malay") {
              console.log(this.listTranslation);
              this.listTranslation.push(LanguageEnum.MALAY_ID);
            }
          })
        }
      });
    } else {
      this.translationService._getTranslationCategoryByTranslationId(this.translation_id).subscribe(data => {
        this.category_id = data.categoryId;
        if (data.language === 'English') {
          this.selectedLanguage = 1;
          this.language_id = LanguageEnum.ENGLISH_ID;
        }
        else if (data.language === 'Chinese') {
          this.selectedLanguage = 2;
          this.language_id = LanguageEnum.CHINESE_ID;
        }
        else {
          this.selectedLanguage = 3;
          this.language_id = LanguageEnum.MALAY_ID;
        }
        this.languageUpdateId = this.language_id;
        this.translate_title = data.title;
        this.translate_description = data.description;
      });
      // get default English
      this.translationService.getListTranslationByCategoryId(this.category_id).subscribe(data => {
        this.listTranslation = data;
        data.forEach(element => {
          if (element.language === "English") {
            this.title = element.title;
            this.description = element.description;
          }
          else if (element.language === "Chinese") {
            this.listTranslation.push(LanguageEnum.CHINESE_ID);
          }
          else if (element.language === "Malay") {
            this.listTranslation.push(LanguageEnum.MALAY_ID);
          }
        })
      });
    }
  }

  back(){
    this.location.back();
  }

  saveTranslation(){
    if (!isNullOrUndefined(this.translate_title) && !isNullOrUndefined(this.translate_description)) {
      const translateObj = {
        language_id: this.language_id,
        translated_title : this.translate_title,
        translated_description: this.translate_description
      }
      this.translationService._updateTranslationProduct(this.translation_id, translateObj).subscribe(data => {
        if (data.code === 200) {
          const dialogNotifi = this.dialog.open(CommonDialogComponent, {
            width: "500px",
            data: {
              message:
                'Update translation successfully.',
              title:
                "NOTIFICATION",
              colorButton: false
            },
          });
          dialogNotifi.afterClosed().subscribe(data => {
            if (this.type === 'product') {
              this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.product_id, type: this.type} });
            }
            else {
              this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.category_id, type: this.type} });
            }
          });
        }
      });
    }
  }

  SelectedTypeLanguage(event){
    this.selectedLanguage = event.value;
    if (this.selectedLanguage === 1) {
      this.language_id = LanguageEnum.ENGLISH_ID;
    }
    if (this.selectedLanguage === 2) {
      this.language_id = LanguageEnum.CHINESE_ID;
    }
    else if (this.selectedLanguage === 3) {
      this.language_id = LanguageEnum.MALAY_ID;
    }
    this.isExistTranslate(this.language_id);
  }

  deleteTranslation(){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Do you wish to delete this translation?', type: "REJECTED" }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.translationService._deleteTranslationProduct(this.translation_id).subscribe(data => {
          if (data.code === 200) {
            const dialogNotifi = this.dialog.open(CommonDialogComponent, {
              width: "500px",
              data: {
                message:
                  'Delete Translation Success.',
                title:
                  "NOTIFICATION",
                colorButton: false
              },
            });
            dialogNotifi.afterClosed().subscribe(data => {
              if (this.type === 'product') {
                this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.product_id, type: this.type} });
              }
              else {
                this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.category_id, type: this.type} });
              }
            });
          }
        });
      } else {
        dialogRef.close();
      }
    });
  }

  isExistTranslate(language_id: number) {
    let result = false;
    this.listTranslation.forEach(element => {
      if (element !== this.languageUpdateId && language_id === element) {
        result = true;
      }
    });
    this.isExist = result;
  }
}