import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://gorest.co.in/public/v2/';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`).pipe(
      catchError(this.handleError)
    );
  }

  getUser(userId: number): Observable<any> {
    if (isNaN(userId) || userId <= 0) {
      return throwError('Invalid user ID');
    }
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserPosts(userId: number): Observable<any[]> {
    if (isNaN(userId) || userId <= 0) {
      return throwError('Invalid user ID');
    }
    return this.http.get<any[]>(`${this.apiUrl}/posts?user_id=${userId}`).pipe(
      catchError(this.handleError)
    );
  }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`).pipe(
      catchError(this.handleError)
    );
  }

  getPostComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts/${postId}/comments`).pipe(
      catchError(this.handleError)
    );
  }

  createUser(newUser: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.apiUrl}/users`, newUser, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addPost(userId: number, post: { body: string; title: string; }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/users/${userId}/posts`, post, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  addComment(postId: number, comment: { body: string; name: string; email: string; }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/posts/${postId}/comments`, comment, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${postId}`).pipe(
      catchError(this.handleError)
    );
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/comments/${commentId}`).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<any> {
    // Use a valid user ID for the current user
    return this.http.get<any>(`${this.apiUrl}/users/7045928`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something bad happened; please try again later.');
  }
}