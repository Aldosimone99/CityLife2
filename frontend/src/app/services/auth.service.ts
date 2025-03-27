import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users'; // Use backend API

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string }>('http://localhost:4200/api/users/login', credentials).pipe(
      tap((response) => {
        localStorage.setItem('authToken', response.token); // Salva il token JWT
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
    return this.http.get<any>(`/api/users/${userId}`);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId'); // Legge l'ID salvato durante il login
    return userId ? parseInt(userId, 10) : null;
  }

  setUserId(userId: number): void {
    localStorage.setItem('userId', userId.toString());
  }
}