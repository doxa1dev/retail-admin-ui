import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {SelectItem} from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslationService } from 'app/core/service/translation.service';
import { isNullOrUndefined } from 'util';
import { element } from 'protractor';
import { LanguageEnum } from 'app/core/models/translation.model';
import { CommonDialogComponent } from 'app/main/_shared/common-dialog/common-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-translation',
  templateUrl: './create-translation.component.html',
  styleUrls: ['./create-translation.component.scss']
})
export class CreateTranslationComponent implements OnInit {

  type: string;
  product_id: number;
  category_id: number;
  language_id: number;
  translated_title: string;
  translated_description: string;
  //
  title: string;
  description: string;
  isExist: boolean = false;
  isErr: boolean = true;
  isShow: boolean = false;

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public translationService: TranslationService,
    public dialog: MatDialog
  ) {

    this.activatedRoute.queryParams.subscribe(param => {
      this.type = param.type;
      if (this.type === 'product') {
        this.product_id = param.id;
      }
      else {
        this.category_id = param.id;
      }
    });

    this.listLanguage=[
      // {
      //   label: 'English (Default)',
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
  selectedLanguage;
  /** Translation list language */
  listLanguage : SelectItem[];
  
  listTranslation: any[];

  ngOnInit(): void {
    this.formTranslation = this.formBuilder.group({
      translationTitle: ['', Validators.required],
      translationDescription: ['', Validators.required],
      // translationLanguage:['English', Validators.required]
    })
    
    this.initView();
    
  }

  initView() {
    if (this.type === 'product') {
      this.translationService.getListTranslationByProductId(this.product_id).subscribe(data => {
        this.listTranslation = data;
        data.forEach(element => {
          if (element.language === 'English') {
            this.title = element.title;
            this.description = element.description;
            // this.selectedLanguage = LanguageEnum.ENGLISH_ID;
            // this.language_id = LanguageEnum.ENGLISH_ID;
          }
        })
      })
    } else {
      this.translationService.getListTranslationByCategoryId(this.category_id).subscribe(data => {
        this.listTranslation = data;
        console.log(data);
        data.forEach(element => {
          if (element.language === 'English') {
            this.title = element.title;
            this.description = element.description;
            // this.selectedLanguage = LanguageEnum.ENGLISH_ID;
            // this.language_id = LanguageEnum.ENGLISH_ID;
          }
        })
      })
    }
  }

  back(){
    this.location.back();
  }

  saveTranslation(){
    if (!isNullOrUndefined(this.translated_title) && !isNullOrUndefined(this.translated_description) && !this.isExist) {
      if (!isNullOrUndefined(this.selectedLanguage)) {
        if (this.type === 'product') {
          const translateObj = {
            language_id: this.language_id,
            product_id: this.product_id,
            translated_title: this.translated_title,
            translated_description: this.translated_description
          }
          this.translationService._creatTranslationProduct(translateObj).subscribe(data => {
            if (data.code === 200) {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Create new translation successfully.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data => {
                this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.product_id, type: this.type} });
              });
            }
          });
        }
        else {
          const translateObj = {
            language_id: this.language_id,
            category_id: this.category_id,
            translated_title: this.translated_title,
            translated_description: this.translated_description
          }
          this.translationService._creatTranslationCategory(translateObj).subscribe(data => {
            if (data.code === 200) {
              const dialogNotifi = this.dialog.open(CommonDialogComponent, {
                width: "500px",
                data: {
                  message:
                    'Create new translation successfully.',
                  title:
                    "NOTIFICATION",
                  colorButton: false
                },
              });
              dialogNotifi.afterClosed().subscribe(data => {
                this.router.navigate(['direct-sales/products/translation'], { queryParams: { id: this.category_id, type: this.type} });
              });
            }
          });
        }
      } else {
        this.isShow = true;
      }
    }
  }

  SelectedTypeLanguage(event){
    this.isErr = false;
    this.selectedLanguage = event.value;
    if (this.selectedLanguage === 1) {
      this.language_id = 1;
    }
    else if (this.selectedLanguage === 2) {
      this.language_id = 4;
    }
    else {
      this.language_id = 5;
    }
    this.isExistLanguage(this.language_id);
  }

  isExistLanguage(language_id: number) {
    let exist = false;
    for (let i = 0; i < this.listTranslation.length; i++) {
      if (language_id == LanguageEnum.ENGLISH_ID && this.listTranslation[i].language === 'English') {
        exist = true;
        break;
      }
      else if (language_id == LanguageEnum.CHINESE_ID && this.listTranslation[i].language === 'Chinese') {
        exist = true;
        break;
      }
      else if (language_id == LanguageEnum.MALAY_ID && this.listTranslation[i].language === 'Malay') {
        exist = true;
        break;
      }
    }
    this.isExist = exist;
  }

}
