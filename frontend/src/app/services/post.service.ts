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

  addPost(postData: { body: string; user: { id: number } }): Observable<any> {
    if (!postData.body || typeof postData.body !== 'string' || postData.body.trim().length < 1) {
      console.error('Invalid post body: must be a string with at least 1 character.');
      return throwError(() => new Error('Invalid post body: must be a string with at least 1 character.'));
    }
    if (!postData.user || isNaN(postData.user.id) || postData.user.id <= 0) {
      console.error('Invalid user ID: must be a positive number.');
      return throwError(() => new Error('Invalid user ID: must be a positive number.'));
    }

    const headers = this.authService.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, postData, { headers }).pipe(
      catchError((error) => {
        let errorMessage = 'An error occurred while adding the post.';
        if (error.error && typeof error.error === 'object' && error.error.error) {
          errorMessage = error.error.error; // Extract JSON error message
        } else if (typeof error.error === 'string') {
          errorMessage = error.error; // Handle plain text error
        }
        console.error('Error adding post:', errorMessage);
        return throwError(() => new Error(errorMessage));
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