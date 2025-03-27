import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:4200/api/posts'; // Sostituisci con l'URL del tuo backend

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching posts:', error);
        return throwError(error);
      })
    );
  }

  addPost(postData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, postData, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding post:', error);
        return throwError(error);
      })
    );
  }

  deletePost(postId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${postId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting post:', error);
        return throwError(error);
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
}