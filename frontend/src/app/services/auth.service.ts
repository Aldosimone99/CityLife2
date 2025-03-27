import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/users'; // Use backend API

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token); // Save the JWT token
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/isAuthenticated`).pipe(
      catchError(() => of(false))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}).pipe(
      catchError(() => of())
    );
  }

  getUser(userId: number): Observable<any> {
    if (isNaN(userId) || userId <= 0) {
      return throwError(() => new Error('Invalid userId: must be a positive number.'));
    }
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map((response) => ({
        id: response.id, // Map 'id' from backend
        firstName: response.firstname, // Map 'firstname' from backend
        lastName: response.lastname, // Map 'lastname' from backend
        email: response.email, // Map 'email' from backend
        age: response.age, // Map 'age' from backend
        gender: response.gender, // Map 'gender' from backend
      })),
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return throwError(error);
      })
    );
  }

  createPost(post: { content: string; userId: number }): Observable<any> {
    if (!post.content || typeof post.content !== 'string' || post.content.trim() === '') {
      return throwError(() => new Error('Invalid post content: must be a non-empty string.'));
    }
    if (isNaN(post.userId) || post.userId <= 0) {
      return throwError(() => new Error('Invalid userId: must be a positive number.'));
    }

    const headers = this.getAuthHeaders(); // Include Authorization header
    return this.http.post<any>(`${this.apiUrl}/posts`, post, { headers }).pipe(
      catchError((error) => {
        console.error('Error creating post:', error);
        return throwError(error);
      })
    );
  }

  getUserId(): number | null {
    if (typeof window !== 'undefined' && localStorage) {
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId, 10) : null;
    }
    return null;
  }

  setUserId(userId: number): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('userId', userId.toString());
    }
  }

  getAuthHeaders(): HttpHeaders {
    if (typeof window !== 'undefined' && localStorage) {
      const token = localStorage.getItem('authToken');
      console.log('Retrieved token:', token); // Log the retrieved token
      return new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });
    }
    return new HttpHeaders();
  }
}