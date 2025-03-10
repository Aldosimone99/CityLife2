import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users'; // Use backend API
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map((response: any) => {
        this.setToken(response.token);
        return { success: true };
      }),
      catchError(error => {
        return of({ success: false });
      })
    );
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      return token !== null && this.isValidToken(token);
    } else {
      console.error('localStorage is not available');
      return false;
    }
  }

  private isValidToken(token: string): boolean {
    // Implement logic to verify if the token is valid
    // For example, you can decode the token and check its expiration
    return true; // Modify this logic as per your requirements
  }

  logout(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }
}