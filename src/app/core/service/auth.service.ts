import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { loginApi, becomeAdvisorApi, forgotPasswordApi, verifyForgotPasswordTokenApi, resetPasswordApi} from './backend-api'
import { ResetPassword } from '../models/reset-pass.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{

    constructor(
        private http: HttpClient,
        private router: Router,
        private api: ApiService
    ) { }


    login(loginForm)
    {
        return this.http.post<any>(loginApi, loginForm);
    }


    forgotPassword(email: string) {
      return this.http.post<any>(forgotPasswordApi, { email });
    }
    verifyForgotPasswordToken(token: string) {
      return this.http.post<any>(verifyForgotPasswordTokenApi, { token });
    }

    resetPassword(resetPassword: ResetPassword) {
      return this.http.post<any>(resetPasswordApi, resetPassword);
    }
    logout()
    {

    }
    becomeAdvisor(customer_id : string,advised_by_customer_id: string , is_buy_discount:boolean){
        let param = new HttpParams();
        param = param.append('customer_id', customer_id);
        param = param.append('advised_by_customer_id', advised_by_customer_id);

        if(this.api.isEnable()){
        return this.http.post<any>(becomeAdvisorApi,{is_buy_discount : is_buy_discount}, { headers: this.api.headers, params: param }).pipe(map((data)=>{
            if(data.code == 200){
              return data
            }else if(data.code == 201){
              return {data: data.message}
            }
        }))
        }
    }

}
