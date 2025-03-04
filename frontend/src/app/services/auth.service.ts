import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; // Cambia l'URL per puntare al backend locale

  constructor(private http: HttpClient) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      map(response => {
        return { success: true, token: response['token'] };
      }),
      catchError(error => {
        return of({ success: false });
      })
    );
  }

  isAuthenticated(): boolean {
    // Implementa la logica per verificare se l'utente è autenticato
    return true; // Modifica questa logica in base alle tue esigenze
  }

  logout(): void {
    // Implementa la logica per il logout
  }

  setToken(token: string): void {
    // Implementa la logica per salvare il token
  }
}