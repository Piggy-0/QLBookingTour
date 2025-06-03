import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../Models/users';
//import { Order } from '../Models/order';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
    private apiUrl = 'http://localhost:5093/api/Reviews';

    private httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": 'application/json'
      })
    }
    constructor(private http: HttpClient) {}

    getReviewById(id: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getReviewsByProduct(tourId: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/tour/${tourId}`);
    }

    addReview(review: any): Observable<any> {
      return this.http.post<any>(this.apiUrl, review);
    }

    getReviewsByUser(userId: number): Observable<any[]> {
      return this.http.get<any>(`${this.apiUrl}/user/${userId}`);
    }

    updateReview(id: number, body: any): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<any>(url, body, this.httpOptions);
      }
    
      // Delete a review by ID
      deleteReview(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
      }
}
