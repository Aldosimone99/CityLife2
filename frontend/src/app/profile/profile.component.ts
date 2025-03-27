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
  newPost: string = ''; // Initialize the newPost property
  isDeleteConfirmationVisible: boolean = false;
  postToDelete: any = null;
  commentToDelete: any = null;

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

  confirmDeleteComment(comment: any) {
    this.commentToDelete = comment;
    // Logic to show a confirmation modal can be added here if needed
  }

  cancelDeleteComment() {
    this.commentToDelete = null;
    // Logic to hide the confirmation modal can be added here if needed
  }

  deleteComment(postId: number, commentId: number) {
    this.commentService.deleteComment(postId, commentId).subscribe(
      () => {
        this.comments[postId] = this.comments[postId].filter((comment: any) => comment.id !== commentId);
        this.cancelDeleteComment();
      },
      (error) => console.error('Error deleting comment:', error)
    );
  }

  addPost() {
    const userId = this.authService.getUserId();
    if (userId && this.newPost.trim()) {
      const post = {
        body: this.newPost,
        userId: userId,
        createdAt: new Date().toISOString()
      };

      this.postService.addPost(post).subscribe(
        (response) => {
          this.posts.unshift({
            ...response,
            userName: `${this.user.firstName} ${this.user.lastName}`,
            createdAt: post.createdAt
          });
          this.newPost = '';
        },
        (error) => console.error('Error adding post:', error)
      );
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
    this.postService.deletePost(postId).subscribe(
      () => {
        this.posts = this.posts.filter((post: any) => post.id !== postId);
        this.cancelDeletePost();
      },
      (error) => console.error('Error deleting post:', error)
    );
  }
}