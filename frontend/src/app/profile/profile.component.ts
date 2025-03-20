import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: false,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];
  newPost: string = '';
  showComments: { [key: number]: boolean } = {};
  comments: { [key: number]: any[] } = {};
  newComment: { [key: number]: string } = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadUserProfile();
    this.fetchPosts();
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.http.get(`/api/users/${userId}`).subscribe(
        (response: any) => {
          this.user = response;
        },
        (error) => {
          console.error('Error loading user profile:', error);
        }
      );
    } else {
      console.error('User ID is not available');
    }
  }
  fetchPosts() {
    const userId = this.authService.getUserId();
    console.log('User ID:', userId); // Per debug
  
    if (userId) {
      this.http.get<any[]>(`/api/posts`).pipe(
        map(posts => 
          posts.filter(post => post.user.id === +userId) // Usa + per forzare la conversione a numero
        )
      ).subscribe(postsWithUsers => {
        console.log('Filtered Posts:', postsWithUsers); // Verifica i post dopo il filtro
        this.posts = postsWithUsers.map(post => ({
          ...post,
          userName: `${post.user.firstName} ${post.user.lastName}`
        }));
      });
    } else {
      console.error('User ID is not available');
    }
  }

  addPost() {
    const userId = this.authService.getUserId();
    if (userId && this.newPost.trim()) {
      const post = {
        body: this.newPost,
        userId: userId
      };
      this.http.post(`/api/posts`, post).subscribe(
        (response: any) => {
          this.posts.unshift({
            ...response,
            user: this.user
          });
          this.newPost = '';
        },
        (error) => {
          console.error('Error adding post:', error);
        }
      );
    }
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  confirmDeletePost(post: any) {
    // Logic to confirm delete post
  }

  confirmDeleteComment(comment: any) {
    // Logic to confirm delete comment
  }

  addComment(postId: number) {
    // Logic to add a new comment
  }

  deletePost() {
    // Logic to delete a post
  }

  deleteComment() {
    // Logic to delete a comment
  }

  cancelDeletePost() {
    // Logic to cancel delete post
  }

  cancelDeleteComment() {
    // Logic to cancel delete comment
  }
}
