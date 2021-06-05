import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  headers: HttpHeaders;
  token: string;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { }

  isEnable() {
    // get token localstorege in localstorage
    this.token = "Bearer " + localStorage.getItem('token');
    // User had logged but profile in localstorage had delete
    if (isNullOrUndefined(this.token) || this.token === "Bearer null") {
      this.router.navigate(["/login"]);
      return false;
    } else {
      this.headers = new HttpHeaders({ Authorization: "Bearer " + localStorage.getItem("token") });
      return true;
    }
  }

  get(resource) {
    if (this.isEnable()) {
      return this.httpClient.get<any>(resource, { headers: this.headers });
    }
  }

  post(resource, data) {
    if (this.isEnable()) {
      return this.httpClient.post<any>(resource, data, { headers: this.headers });
    }
  }

  put(resource, data) {
    if (this.isEnable()) {
      return this.httpClient.put<any>(resource, data, { headers: this.headers });
    }
  }

  delete(resource) {
    if (this.isEnable()) {
      return this.httpClient.delete<any>(resource, { headers: this.headers });
    }
  }


}
