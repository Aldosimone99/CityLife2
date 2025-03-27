import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = '/api/posts'; // Sostituisci con l'URL del tuo backend

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(): Observable<any[]> {
    const headers = this.authService.getAuthHeaders();
    console.log('Headers:', headers);
  
    const token = headers.get('Authorization');
    console.log('Authorization header:', token); 
  
    if (!token) {
      console.error('Authorization token is missing');
      return throwError(() => new Error('Authorization token is missing'));
    }
  
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching posts:', error);
        return throwError(() => error);
      })
    );
  }

  addPost(postData: { content: string; userId: number }): Observable<any> {
    if (!postData.content || typeof postData.content !== 'string' || postData.content.trim().length < 1) {
      return throwError(() => new Error('Invalid post content: must be a string with at least 1 characters.'));
    }
    if (isNaN(postData.userId) || postData.userId <= 0) {
      return throwError(() => new Error('Invalid userId: must be a positive number.'));
    }

    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, postData, { headers }).pipe(
      catchError((error) => {
        console.error('Error adding post:', error);
        return throwError(error);
      })
    );
  }

  deletePost(postId: number): Observable<any> {
    if (isNaN(postId) || postId <= 0) {
      return throwError(() => new Error('Invalid postId: must be a positive number.'));
    }

    const headers = this.authService.getAuthHeaders();
    return this.http.delete<any>(`${this.apiUrl}/${postId}`, { headers }).pipe(
      catchError((error) => {
        console.error('Error deleting post:', error);
        return throwError(error);
      })
    );
  }
}