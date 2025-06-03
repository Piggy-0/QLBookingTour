import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Report } from '../Models/report';


@Injectable({
  providedIn: 'root'
})
export class ReportService {
    private APIURL = 'http://localhost:5093/api/report';

    private httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": 'application/json'
      })
    }

   constructor(private http: HttpClient) {}
    
  // Lấy lịch sử báo cáo
   getReportHistory(): Observable<Report[]> {
     return this.http.get<Report[]>(`${this.APIURL}/bookings/history`);
   }


    createReport(): Observable<Report> {
        return this.http.post<Report>(this.APIURL + '/bookings/month', {});
    }

    deleteReport(id: number): Observable<any> {
    return this.http.delete<any>(`${this.APIURL}/bookings/${id}`);
  }

}
