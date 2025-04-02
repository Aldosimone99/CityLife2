import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for formatting
import { HttpClient } from '@angular/common/http'; // Import HttpClient

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  standalone: false,
})
export class UserDetailComponent implements OnInit {
  user: any;
  posts: any[] = [];
  comments: { [key: number]: any[] } = {};
  showComments: { [key: number]: boolean } = {};
  newComment: { [key: number]: string } = {}; // Add a newComment object to store new comments
  commentToDelete: any = null; // Add a variable to store the comment to be deleted
  isDeleteCommentConfirmationVisible: boolean = false; // Add a variable to control the visibility of the delete comment confirmation modal
  userPosts: any;
  loggedInUserId: number | null = null; // Add a property to store the logged-in user's ID

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const userIdNumber = Number(userId); // Converti la stringa in numero
      if (!isNaN(userIdNumber)) {
        this.loadUserData(userIdNumber);
      } else {
        console.error('Invalid user ID:', userId);
      }
    } else {
      console.error('User ID not found in route parameters');
    }
    this.loggedInUserId = this.getLoggedInUserId(); // Set the logged-in user's ID
  }

  getLoggedInUserId(): number | null {
    // Replace with your logic to retrieve the logged-in user's ID (e.g., from AuthService or localStorage)
    return Number(localStorage.getItem('userId')) || null;
  }

  loadUserData(userId: number): void {
    if (!this.user) {
      this.userService.getUser(userId).subscribe(user => {
        this.user = user;
      });
    }
    if (this.posts.length === 0) {
      const authToken = this.getAuthToken(); // Retrieve the auth token
      this.userService.getUserPosts(userId, authToken) // Pass the token to the service
        .subscribe(posts => {
          this.posts = posts.map(post => ({
            ...post,
            userName: post.user ? `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User', // Handle undefined user
            createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
          })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }, error => {
          console.error('Error fetching posts:', error); // Log error for debugging
        });
    }
  }

  getAuthToken(): string {
    // Replace with your logic to retrieve the token (e.g., from localStorage or a service)
    return localStorage.getItem('authToken') || '';
  }

  toggleComments(postId: number): void {
    if (!this.comments[postId]) {
      this.fetchComments(postId);
      this.showComments[postId] = true;
    } else {
      this.showComments[postId] = !this.showComments[postId];
    }
  }

  fetchComments(postId: number): void {
    this.http.get<any[]>(`/api/posts/${postId}/comments`).subscribe(
      (response) => {
        console.log('Fetched comments:', response); // Log the response for debugging
        this.comments[postId] = response.map(comment => ({
          ...comment,
          body: comment.content ? comment.content.trim() : 'No content available', // Map 'content' to 'body' for display
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
          this.comments[postId].push(response);
          this.newComment[postId] = '';
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }

  confirmDeleteComment(comment: any): void {
    if (comment.userId === this.loggedInUserId) { // Check if the logged-in user is the author of the comment
      this.commentToDelete = comment;
      this.isDeleteCommentConfirmationVisible = true;
    } else {
      console.error('You are not authorized to delete this comment');
    }
  }

  cancelDeleteComment(): void {
    this.commentToDelete = null;
    this.isDeleteCommentConfirmationVisible = false;
  }

  deleteComment(): void {
    if (this.commentToDelete) {
      this.userService.deleteComment(this.commentToDelete.id).subscribe(() => {
        const postId = this.commentToDelete.postId;
        this.comments[postId] = this.comments[postId].filter(comment => comment.id !== this.commentToDelete.id); // Remove the deleted comment from the comments array
        this.commentToDelete = null;
        this.isDeleteCommentConfirmationVisible = false;
      }, (error: unknown) => { // Explicitly type the error parameter
        console.error('Error deleting comment:', error); // Log for debugging
      });
    }
  }

  fetchPosts(): void {
    const userId = this.route.snapshot.paramMap.get('id'); // Ottieni l'ID dell'utente dalla route
    if (userId) {
      const userIdNumber = Number(userId); // Converti l'ID in numero
      if (!isNaN(userIdNumber)) {
        const authToken = this.getAuthToken(); // Recupera il token di autenticazione
        this.userService.getUserPosts(userIdNumber, authToken) // Passa l'ID e il token al servizio
          .subscribe(posts => {
            this.posts = posts.map((post: any) => ({
              ...post,
              userName: post.user ? `${post.user.firstName || ''} ${post.user.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User', // Handle undefined user
              createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) // Formatta la data
            })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // Carica i commenti per ogni post
            this.posts.forEach(post => this.fetchComments(post.id));
          }, error => {
            console.error('Error fetching posts:', error); // Log per il debugging
          });
      } else {
        console.error('Invalid user ID:', userId);
      }
    } else {
      console.error('User ID not found in route parameters');
    }
  }
}