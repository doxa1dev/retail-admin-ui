import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { Subject} from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { animation } from '@angular/animations';
import { SelectItem } from 'primeng/api';
import { MustMatch } from '../_helper/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations: fuseAnimations
})


export class RegisterComponent implements OnInit {
  registerForm  : FormGroup;
  private _unsubscribeAll: Subject<any>;
  designations : SelectItem[];
  selectedDesignation: string;
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _formBuilder: FormBuilder
  ) { 
    this.designations = [
      { value: "Mr.", label: "Mr."},
      { value: "Ms.", label: "Ms." },
      { value: "Mrs.", label: "Mrs." },
      { value: "Miss.", label: "Miss." }
    ]
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNum: ['', [Validators.required, phoneNumberValidator]],
      AdId:[],
      AdNa:[],
      // password: ['', [Validators.required, Validators.pattern('^.{8,}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // confirmPassword: ['', [Validators.required,confirmPasswordValidator]],
      confirmPassword:['',[Validators.required]]
    },{
      validator: MustMatch('password', 'confirmPassword')
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.registerForm.get('password').valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() =>
      {
        this.registerForm.get('passwordConfirm').updateValueAndValidity();
      });
  }
  ngOnDestroy(): void
  {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
function phoneNumberValidator(registerForm : FormControl){
  if(isNaN(registerForm.value) === false){
    return null;
  }
  return { phoneNum : true};
}
