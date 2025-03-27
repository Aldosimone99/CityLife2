import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/users'; // Use backend API

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        // Salva l'ID dell'utente in una variabile o in memoria
        localStorage.setItem('userId', response.id.toString()); // Salva l'ID in localStorage
        return { success: true, userId: response.id };
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return of({ success: false });
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
}