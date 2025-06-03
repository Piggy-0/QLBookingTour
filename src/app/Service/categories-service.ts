import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError, BehaviorSubject } from "rxjs";



@Injectable({
  providedIn: 'root'
})

export class CategoriesService {
    private APIURL = 'http://localhost:5093/api';
    private httpOptions = {
      headers: new HttpHeaders({
          "Content-Type": 'application/json'
      })
  }
    constructor(private http : HttpClient) { }
  
  
    public getDsdanhmuc(): Observable<any> {
      const url = `${this.APIURL}/DanhMuc`;
      return this.http.get<any>(url, this.httpOptions)
    }
  
    public getdetailsDanhMuc(id: number):Observable<any>{
      const url = `${this.APIURL}/DanhMuc/${id}`;
      return this.http.get<any>(url, this.httpOptions)
    }
  
    public deleteDsdanhmuc(id:number){
      const url = `${this.APIURL}/DanhMuc/${id}`;
      return this.http.delete<any>(url, this.httpOptions)
  
    }
  
    public addDsdanhmuc(data:any){
      const url = `${this.APIURL}/DanhMuc`;
      return this.http.post<any>(url, data)
    }
  
    public updateDsDanhMuc(id: number,data: any): Observable<any> {
      const url = `${this.APIURL}/DanhMuc/${id}`;
      return this.http.put<any>(url, data, this.httpOptions)
        .pipe(
          catchError(error => {
            // Handle errors
            return throwError('Failed to update DanhMuc');
          })
        );
    }
}
