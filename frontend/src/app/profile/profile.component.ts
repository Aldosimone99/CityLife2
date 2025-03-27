import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  user: any = {};
  posts: any[] = [];
  showComments: { [key: number]: boolean } = {};
  comments: { [key: number]: any[] } = {};
  newComment: { [key: number]: string } = {};

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.fetchPosts();
  }

  loadUserProfile() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.authService.getUser(userId).subscribe(
        (response) => (this.user = response),
        (error) => console.error('Error loading user profile:', error)
      );
    } else {
      console.error('User ID is not available');
    }
  }

  fetchPosts() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.postService.getPosts().pipe(
        map(posts => (posts as any[]).filter((post: any) => post.user.id === +userId))
      ).subscribe(postsWithUsers => {
        this.posts = postsWithUsers.map((post: any) => ({
          ...post,
          userName: `${post.user.firstName} ${post.user.lastName}`
        })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Carica i commenti per ogni post
        this.posts.forEach(post => this.fetchComments(post.id));
      });
    }
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  fetchComments(postId: number) {
    this.commentService.getComments(postId).subscribe(
      (response) => {
        this.comments[postId] = response.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }));
      },
      (error) => console.error('Error fetching comments:', error)
    );
  }

  addComment(postId: number) {
    const userId = this.authService.getUserId();
    if (userId && this.newComment[postId]?.trim()) {
      const comment = {
        content: this.newComment[postId],
        userId: userId,
        createdAt: new Date().toISOString()
      };

      this.commentService.addComment(postId, comment).subscribe(
        (response) => {
          if (!this.comments[postId]) {
            this.comments[postId] = [];
          }
          this.comments[postId].push({
            ...response,
            createdAt: comment.createdAt
          });
          this.newComment[postId] = '';
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }

  deleteComment(postId: number, commentId: number) {
    this.commentService.deleteComment(postId, commentId).subscribe(
      () => {
        this.comments[postId] = this.comments[postId].filter((comment: any) => comment.id !== commentId);
      },
      (error) => console.error('Error deleting comment:', error)
    );
  }
}