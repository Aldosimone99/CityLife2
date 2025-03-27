import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:4200/api/posts'; // Sostituisci con l'URL del tuo backend

  constructor(private http: HttpClient) {}

  getPosts() {
    const token = localStorage.getItem('authToken'); // Assicurati che il token sia salvato dopo il login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(this.apiUrl, { headers });
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${postId}`);
  }

  addPost(post: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, post);
  }
}