import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

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
    this.loadUserPosts();
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

  loadUserPosts() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.http.get(`/api/users/${userId}/posts`).subscribe(
        (response: any) => {
          this.posts = response;
        },
        (error) => {
          console.error('Error loading user posts:', error);
        }
      );
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
