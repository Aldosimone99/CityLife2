import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(userId: number): Observable<any> {
    return this.http.get<any>(`/api/users/${userId}`);
  }

  getUserId(): number | null {
    // Replace the following logic with the actual implementation to retrieve the user ID
    const userId = localStorage.getItem('userId');
    return userId ? +userId : null;
  }

  getCurrentUser() {
    const userId = this.getUserId(); // Assuming a method to get the current user ID exists
    if (userId) {
      return this.getUser(userId); // Assuming a method to fetch user details by ID exists
    } else {
      throw new Error('User ID is not available');
    }
  }

  createUser(userData: any): Observable<any> {
    return this.http.post<any>('/api/users', userData).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(error);
      })
    );
  }

  getUserPosts(userId: number, authToken: string): Observable<any[]> {
    const headers = { Authorization: `Bearer ${authToken}` }; // Add the token to headers
    return this.http.get<any[]>(`/api/users/${userId}/posts`, { headers });
  }

  getPostComments(postId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/posts/${postId}/comments`).pipe(
      catchError((error) => {
        console.error('Error fetching post comments:', error);
        return throwError(error);
      })
    );
  }

  addPost(postData: any): Observable<any> {
    return this.http.post<any>('/api/posts', postData).pipe(
      catchError((error) => {
        console.error('Error adding post:', error);
        return throwError(error);
      })
    );
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete<any>(`/api/posts/${postId}`).pipe(
      catchError((error) => {
        console.error('Error deleting post:', error);
        return throwError(error);
      })
    );
  }

  addComment(postId: number, commentData: any): Observable<any> {
    return this.http.post<any>(`/api/posts/${postId}/comments`, commentData).pipe(
      catchError((error) => {
        console.error('Error adding comment:', error);
        return throwError(error);
      })
    );
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete<any>(`/api/comments/${commentId}`).pipe(
      catchError((error) => {
        console.error('Error deleting comment:', error);
        return throwError(error);
      })
    );
  }

}