import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { map } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for formatting

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
        (response) => {
          this.user = {
            id: response.id,               // Map 'id' from the database
            firstName: response.firstname, // Map 'firstname' from the database
            lastName: response.lastname,   // Map 'lastname' from the database
            email: response.email,         // Map 'email' from the database
            age: response.age,             // Map 'age' from the database
            gender: response.gender        // Map 'gender' from the database
          };
        },
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
        map(posts => (posts as any[]).filter((post: any) => post.user && post.user.id === +userId)) // Add null check for post.user
      ).subscribe(postsWithUsers => {
        this.posts = postsWithUsers.map((post: any) => ({
          ...post,
          userName: post.user ? `${post.user.firstName} ${post.user.lastName}` : 'Unknown User', // Handle undefined user
          createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) // Format as "x time ago"
        })).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Load comments for each post
        this.posts.forEach(post => this.fetchComments(post.id));
      });
    }
  }

  toggleComments(postId: number) {
    this.showComments[postId] = !this.showComments[postId];
  }

  fetchComments(postId: number) {
    this.authService.getComments(postId).subscribe(
      (response) => {
        this.comments[postId] = response.map((comment: any) => ({
          ...comment,
          createdAt: formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) // Format as "x time ago"
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
        author: `${this.user.firstName} ${this.user.lastName}` // Use the user's full name as the author
      };

      this.authService.createComment(postId, comment).subscribe(
        (response) => {
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

  confirmDeleteComment(comment: any) {
    this.commentToDelete = comment;
    this.isDeleteConfirmationVisible = true; // Ensure this is for comments
  }

  cancelDeleteComment() {
    this.commentToDelete = null;
    this.isDeleteConfirmationVisible = false; // Hide the confirmation modal
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
    if (userId && this.newPost.trim().length >= 1) {
      const post = {
        body: this.newPost.trim(), // Use 'body' to match the backend
      };

      this.postService.addPost(post).subscribe(
        (response) => {
          this.posts.unshift({
            ...response,
            userName: response.user ? `${response.user.firstName} ${response.user.lastName}` : 'Unknown User', // Use user details from the response
            createdAt: response.createdAt
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
    this.isDeleteConfirmationVisible = true; // Ensure this is for posts
    this.postToDelete = post;
  }

  cancelDeletePost() {
    this.isDeleteConfirmationVisible = false; // Ensure this is for posts
    this.postToDelete = null;
  }

  deletePost(postId: number) {
    if (isNaN(postId) || postId <= 0) {
      console.error('Invalid postId: must be a positive number.');
      return;
    }

    this.postService.deletePost(postId).subscribe(
      () => {
        this.posts = this.posts.filter((post: any) => post.id !== postId);
        this.cancelDeletePost();
      },
      (error) => console.error('Error deleting post:', error)
    );
  }
}