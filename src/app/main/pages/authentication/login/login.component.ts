import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder,FormGroup,Validators,FormControl} from '@angular/forms';

import { FuseConfigService} from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { LoginService} from './login.service';
import { ActivatedRoute, Router} from '@angular/router'
import { MatCarouselSlide, MatCarouselSlideComponent } from '@ngmodule/material-carousel';
import { AuthService } from 'app/core/service/auth.service'
import { isNullOrUndefined } from 'util';
import * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  animations : fuseAnimations
})
export class LoginComponent implements OnInit {
  message : string;
  loginForm: FormGroup;
  tokenParam: string;
  slides = [{image: "assets/Banner1.png"},{image: "assets/Banner2.png"}];
  constructor
  (
    private _fuseConfigService : FuseConfigService,
    private _formBuilder : FormBuilder,
    private _loginService : LoginService,
    private _auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  )
  {
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
    }
  }

  isDisable: boolean = false
  submitted = false;
  isError : boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.tokenParam = params.tokenParam;
    });
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern]],
      password: ['', [Validators.required, Validators.pattern('^.{8,}$')]]
    });

  }
  get f() { return this.loginForm.controls; }
  onSubmit(){

    if (this.loginForm.value.password.length < 8) {
      console.log('oops');
      this.isError = true;
      this.message = 'Password must be longer than or equal to 8 characters'
    }
      this._auth.login(this.loginForm.value).subscribe(data=>{
        // console.log(data.code);
         if(data.code === 200){
           localStorage.setItem("token", data.accessToken);
           let token = localStorage.getItem('token');
           let decoded: any
           if (!isNullOrUndefined(token)){
               decoded = jwt_decode(token);
               if(
                 decoded.role.includes("RETAIL_SUPER_ADMIN") ||
                 decoded.role.includes("RETAIL_ADMIN") ||
                 decoded.role.includes("RETAIL_WH_ADMIN") ||
                 decoded.role.includes("RETAIL_CS_ADMIN") ||
                 decoded.role.includes("RETAIL_AC_ADMIN")
                 )
               {
                 this.router.navigate(['/direct-sales/orders'])
               }else if(decoded.role.includes("RETAIL_IT_ADMIN"))
               {
                 this.router.navigate(['/direct-sales/sales-team/naep'])
               }else if(decoded.role.includes("MARKETING_ADMIN"))
               {
                 this.router.navigate(['/direct-sales/news/all'])
               } else if (decoded.role.includes("RETAIL_SUPER_ADMIN_SETTING")) {
                 this.router.navigate(['/direct-sales/configuration/naep-roles'])
               }
           }
         }
         else if (data.code === 201){
           this.isError = true;
           this.message = 'Email or password is incorrect.'

         } else if(data.code === 202) {
          this.isError = true;
          this.message = 'This account does not exist.'

         } else {
           window.location.reload();
         }
       })


  }

  nextToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }


}
