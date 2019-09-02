import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class RequestService implements OnInit {

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  get(url:string, headers:HttpHeaders): Promise<any> {

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.get(url, options)
      .toPromise()
      .then((res:any) => {
        resolve(res);
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        reject(err);
      });
    });
  }

  post(url:string, body:any, headers:HttpHeaders): Promise<any> {

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.post(url, body, options)
      .toPromise()
      .then((res:any) => {
        resolve(res);
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        reject(err);
      });
    });
  }

  put(url:string, body:any, headers:HttpHeaders): Promise<any> {

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.put(url, body, options)
      .toPromise()
      .then((res:any) => {
        resolve(res);
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        reject(err);
      });
    });
  }

  delete(url:string, headers:HttpHeaders): Promise<any> {

    let options = {};
    if (headers) {
      options['headers'] = headers;
    }

    return new Promise<any>((resolve, reject) => {
      this.http.delete(url, options)
      .toPromise()
      .then((res:any) => {
        resolve(res);
      }).catch((err:Response) => {
        this.handleErrorResponse(err);
        reject(err);
      });
    });
  }

  private handleErrorResponse(err:any): void {
    console.log(err);
  }

}