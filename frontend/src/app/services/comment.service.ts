import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class CommentService {
  private apiUrl = '/api/posts'; // Base API URL

constructor(private http: HttpClient) {}

getComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${postId}/comments`);
}

getComment(postId: number, commentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${postId}/comments/${commentId}`);
}

addComment(postId: number, comment: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${postId}/comments`, comment);
}

updateComment(postId: number, commentId: number, comment: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${postId}/comments/${commentId}`, comment);
}

deleteComment(postId: number, commentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${postId}/comments/${commentId}`);
}
}