import { CheckNullOrUndefinedOrEmpty } from 'app/core/utils/common-function';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/service/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MustMatch } from '../_helper/must-match.validator';
import { ResetPassword } from 'app/core/models/reset-pass.model';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
  slides = [{image: "assets/Banner1.png"},{image: "assets/Banner2.png"}];
  forgotForm: FormGroup;
  resetForm: FormGroup;
  submitted = false;
  isError : boolean = false;
  isError2 : boolean = false;
  message: string;
  message2: string;
  serverResponseMsg: string;
  isEmailSent: boolean  = false;
  isEmailSentError: boolean  = false;
  isShowCheck: boolean  = false;
  token: string;
  isValidToken: boolean = false;
  isTokenVerifyError: boolean;
  isShowEnterEmail: boolean;
  isPasswordReset: boolean = false;
  isPasswordResetError: boolean;

  constructor
    ( private _auth: AuthService,
      private _fuseConfigService: FuseConfigService,
      private activatedRoute: ActivatedRoute,
      private _formBuilder: FormBuilder,
      private router: Router,

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
  get f() { return this.forgotForm.controls; }

  ngOnInit(): void
  {

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.token = params.get('token');

      if (CheckNullOrUndefinedOrEmpty(this.token)) {
        this.isValidToken = false;
        this.forgotForm = this._formBuilder.group({
          email: ['', [Validators.required, Validators.email]]
        });
      }
      else {
        this._auth.verifyForgotPasswordToken(this.token).subscribe(response => {
          this.isValidToken = response.isValidToken;
          console.log(response);
          if (this.isValidToken) {
            this.resetForm = this._formBuilder.group({
              newPassword: ['', [Validators.required, Validators.minLength(8)]],
              confirmPassword: ['', Validators.required]
            },
              {
                validator: [
                  MustMatch('newPassword', 'confirmPassword')
                ]
              });
          }
          // else {

          //   this.serverResponseMsg = response.message;
          // }
        });
      }


    });
  }
  onSubmit(type: string) {


    if (type === 'forgot') {
      this.forgotForm.controls["email"].markAsPristine();
      this.forgotForm.value.email = this.forgotForm.value.email.trim().toLowerCase();
      this._auth.forgotPassword(this.forgotForm.value.email).subscribe(response => {
        if (response.code === 200) {

          this.isError2 = true;
          this.isError = false;
          this.message2 = response.message;

        } else {
          this.isError2 = false;
        }
        if (response.code === 404) {
          this.isError = true;
          this.isError2 = false;
          this.message = response.message;
        } else {
          this.isError = false;
        }
      });
    }

    if (type === 'reset') {
      const resetPassword: ResetPassword = {
        newPassword: this.resetForm.value.newPassword,
        confirmPassword: this.resetForm.value.confirmPassword,
        token: this.token
      };
      this._auth.resetPassword(resetPassword).subscribe(response => {
        if (response.code === 200) {
          this.isPasswordReset = true;
          this.serverResponseMsg = "Password has been successfully changed!!";

        }
        // else {
        //   this.serverResponseMsg = "Password has been changed.";
        // }
      //  this.serverResponseMsg = response.message;
      });

    }

  }

  backToLogin() {
    this.router.navigate(['/login']);
  }

}
