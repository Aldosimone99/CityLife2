import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gorest.co.in/public/v2/';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {}

  login(credentials: { token: string }): Observable<any> {
    return this.http.get(`${this.apiUrl}users`, {
      headers: { Authorization: `Bearer ${credentials.token}` }
    }).pipe(
      map(response => {
        this.setToken(credentials.token);
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
    // Implementa la logica per verificare se il token è valido
    // Ad esempio, puoi decodificare il token e verificare la sua scadenza
    return true; // Modifica questa logica in base alle tue esigenze
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