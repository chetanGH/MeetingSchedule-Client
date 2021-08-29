import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCallService {

  constructor(
    private http: HttpClient
  ) { }

  post(url:any, body:Object) {
    return this.http.post(url, body);
  }
}
