import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class VehicleService {
    private APIUrl = 'http://localhost:5093/api';
    readonly PhotosUrl = 'http://localhost:5093/Photos';
  
    private httpOptions = {
      headers: new HttpHeaders({
          "Content-Type": 'application/json'
      })
    }
  
    constructor(private http: HttpClient) {}
  
    getVehicles(): Observable<any> {
      return this.http.get<any>(this.APIUrl+'/Vehicles');
    }
  
    getVehiclesDetails(id: number): Observable<any> {
      const url = `${this.APIUrl}/Vehicles/${id}`;
      return this.http.get<any>(url);
    }
  
    // getTourByIdDM(id: number): Observable<any>{
    //   const url = `${this.APIUrl}/Tours/DanhMuc/${id}`;
    //   return this.http.get<any>(url);
    // }
  
    timkiem(searchText :string): Observable<any>{
      const url = `${this.APIUrl}/Vehicles/search/${searchText}`;
      return this.http.get<any>(url);
    }
  
    postVehicles(body: any){
      const url = `${this.APIUrl}/Vehicles`;
      return this.http.post(url, body);
    }
  
    updateVehicles(id: number, body: any): Observable<any> {
      const url = `${this.APIUrl}/Vehicles/${id}`;
      return this.http.put<any>(url, body, this.httpOptions);
    }
  
    deleteVehicles(id:number): Observable<any>{
      const url = `${this.APIUrl}/Vehicles/${id}`;
      return this.http.delete<any>(url);
    }
  
    taiAnh(val:any){
      return this.http.post(this.APIUrl+"/Vehicles/SaveFile", val);
    }
}
