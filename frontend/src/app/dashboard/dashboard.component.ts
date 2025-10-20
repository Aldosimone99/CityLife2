import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'; // Correct import for date-fns v4
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
standalone: false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  posts: any[] = [];
  showComments: { [key: number]: boolean } = {};
  comments: { [key: number]: any[] } = {};
  newComment: { [key: number]: string } = {};
  newPost: string = ''; // Initialize the newPost property
  userName: string = ''; // Variabile per il nome completo dell'utente
  isDeleteConfirmationVisible: boolean = false;
  postToDelete: any = null;
  commentToDelete: any = null;
  loggedInUserId: number | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.fetchUserDetails(); // Recupera i dettagli dell'utente loggato
    this.fetchPosts();
    this.loggedInUserId = this.authService.getUserId(); // Set the logged-in user's ID
  }

  fetchUserDetails() {
    const headers = this.authService.getAuthHeaders(); // Recupera l'header di autorizzazione
    this.http.get<any>('/api/users/me', { headers }).subscribe(
      (response) => {
        this.userName = `${response.firstName} ${response.lastName}`.trim(); // Imposta il nome completo
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  fetchPosts() {
    this.http.get<any[]>('/api/posts').pipe(
      map(posts => posts.map(post => ({
        ...post,
        userName: post.user && post.user.firstName && post.user.lastName 
          ? `${post.user.firstName} ${post.user.lastName}` 
          : 'Unknown User', // Handle undefined user or missing properties
        createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }), // Format as "x time ago"
        originalCreatedAt: post.createdAt // Keep original timestamp for sorting
      })).sort((a, b) => new Date(b.originalCreatedAt).getTime() - new Date(a.originalCreatedAt).getTime())),
    ).subscribe(postsWithUsers => {
      this.posts = postsWithUsers;
    });
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
    if (this.showComments[postId] && !this.comments[postId]) {
      this.fetchComments(postId);
    }
  }

  fetchComments(postId: number) {
    this.http.get<any[]>(`/api/posts/${postId}/comments`).subscribe(
      (response) => {
        this.comments[postId] = response.map(comment => ({
          ...comment,
          createdAt: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) // Format as "x time ago"
        }));
      },
      (error) => console.error('Error fetching comments:', error)
    );
  }

  addComment(postId: number) {
    if (this.newComment[postId]?.trim()) {
      const comment = { content: this.newComment[postId] };
      this.http.post(`/api/posts/${postId}/comments`, comment).subscribe(
        (response: any) => {
          if (!this.comments[postId]) {
            this.comments[postId] = [];
          }
          
          console.log('Comment response from server:', response); // Debug log
          console.log('Comment createdAt value:', response.createdAt); // Debug log
          
          // Ensure we have a valid date, otherwise use current time
          let createdAtDate;
          if (response.createdAt) {
            createdAtDate = new Date(response.createdAt);
            // Check if the date is valid
            if (isNaN(createdAtDate.getTime())) {
              console.warn('Invalid comment date from server, using current time');
              createdAtDate = new Date();
            }
          } else {
            console.warn('No comment createdAt from server, using current time');
            createdAtDate = new Date();
          }
          
          // Format the createdAt timestamp before adding to the comments array
          const formattedComment = {
            ...response,
            createdAt: formatDistanceToNow(createdAtDate, { addSuffix: true })
          };
          this.comments[postId].push(formattedComment);
          this.newComment[postId] = '';
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }

  addPost() {
    if (this.newPost.trim().length >= 1) {
      const post = {
        body: this.newPost.trim(), // Use 'body' to match the backend
      };

      this.http.post('/api/posts', post).subscribe(
        (response: any) => {
          console.log('Response from server:', response); // Debug log
          console.log('CreatedAt value:', response.createdAt); // Debug log
          
          // Ensure we have a valid date, otherwise use current time
          let createdAtDate;
          if (response.createdAt) {
            createdAtDate = new Date(response.createdAt);
            // Check if the date is valid
            if (isNaN(createdAtDate.getTime())) {
              console.warn('Invalid date from server, using current time');
              createdAtDate = new Date();
            }
          } else {
            console.warn('No createdAt from server, using current time');
            createdAtDate = new Date();
          }
          
          this.posts.unshift({
            ...response,
            userName: response.user ? `${response.user.firstName} ${response.user.lastName}` : 'Unknown User',
            createdAt: formatDistanceToNow(createdAtDate, { addSuffix: true }),
            originalCreatedAt: response.createdAt || new Date().toISOString() // Keep original timestamp for sorting
          });
          this.newPost = '';
        },
        (error) => {
          console.error('Error adding post:', error.error || error.message || error);
        }
      );
    } else {
      console.error('Post body must be at least 1 character long');
    }
  }

  confirmDeletePost(post: any) {
    this.isDeleteConfirmationVisible = true;
    this.postToDelete = post;
  }

  cancelDeletePost() {
    this.isDeleteConfirmationVisible = false;
    this.postToDelete = null;
  }

  deletePost(postId: number) {
    this.http.delete(`/api/posts/${postId}`).subscribe(
      () => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.cancelDeletePost();
      },
      error => console.error('Error deleting post:', error)
    );
  }

  confirmDeleteComment(comment: any) {
    this.commentToDelete = comment;
    this.isDeleteConfirmationVisible = true;
  }

  cancelDeleteComment() {
    this.commentToDelete = null;
    this.isDeleteConfirmationVisible = false;
  }

  deleteComment(postId: number, commentId: number) {
    this.http.delete(`/api/posts/${postId}/comments/${commentId}`).subscribe(
      () => {
        this.comments[postId] = this.comments[postId].filter(comment => comment.id !== commentId);
        this.cancelDeleteComment();
      },
      error => console.error('Error deleting comment:', error)
    );
  }
}
