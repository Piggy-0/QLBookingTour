import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tours } from '../Models/tours';

@Injectable({
  providedIn: 'root'
})

export class TourService {
    private APIUrl = 'http://localhost:5093/api';
    readonly PhotosUrl = 'http://localhost:5093/Photos';
  
    private httpOptions = {
      headers: new HttpHeaders({
          "Content-Type": 'application/json'
      })
    }

    constructor(private http: HttpClient) {}

    getTours(): Observable<any> {
      return this.http.get<any>(this.APIUrl+'/Tours');
    }
  
    getTourDetails(id: number): Observable<any> {
      const url = `${this.APIUrl}/Tours/${id}`;
      return this.http.get<any>(url);
    }
  
    getTourByIdDM(id: number): Observable<any>{
      const url = `${this.APIUrl}/Tours/DanhMuc/${id}`;
      return this.http.get<any>(url);
    }
  
    timkiem(searchText :string): Observable<any>{
      const url = `${this.APIUrl}/Tours/search/${searchText}`;
      return this.http.get<any>(url);
    }
  
    postTour(body: any){
      const url = `${this.APIUrl}/Tours`;
      return this.http.post(url, body);
    }
  
  
    updateTour(id: number, body: any): Observable<any> {
      const url = `${this.APIUrl}/Tours/${id}`;
      return this.http.put<any>(url, body, this.httpOptions);
    }
  
    deleteTour(id:number): Observable<any>{
      const url = `${this.APIUrl}/Tours/${id}`;
      return this.http.delete<any>(url);
    }
  
    taiAnh(val:any){
      return this.http.post(this.APIUrl+"/Tours/SaveFile", val);
    }
  
}
