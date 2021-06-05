import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams,HttpResponse,} from '@angular/common/http'
import { Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient){}
  Service_Login(loginForm)
  {
    const url = "http://api.ari.com.vn/auth/signin";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    const body = JSON.stringify(loginForm);
    return this.http.post(url, body, httpOptions).toPromise().then(res=>res)
  }
}
