import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'; // Correct import for date-fns v4

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
  isEditModalVisible: boolean = false;
  editableUser: any = {};
  loggedInUserId: number | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private commentService: CommentService,
    private http: HttpClient // Aggiungi HttpClient
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    this.fetchPosts();
    this.loggedInUserId = this.authService.getUserId(); // Set the logged-in user's ID
  }

  loadUserProfile() {
    const headers = this.authService.getAuthHeaders(); // Recupera l'header di autorizzazione
    this.http.get<any>('/api/users/me', { headers }).subscribe(
      (response) => {
        this.user = {
          id: response.id,
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
          age: response.age,
          gender: response.gender
        };
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
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
          createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }), // Format as "x time ago"
          originalCreatedAt: post.createdAt // Keep original timestamp for sorting
        })).sort((a: any, b: any) => new Date(b.originalCreatedAt).getTime() - new Date(a.originalCreatedAt).getTime());

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

  openEditModal() {
    this.editableUser = { ...this.user, password: '' }; // Clone the user object and add a password field for editing
    this.isEditModalVisible = true; // Ensure this is set to true
  }

  closeEditModal() {
    this.isEditModalVisible = false; // Ensure this is set to false
  }

  updateUserDetails() {
    const headers = this.authService.getAuthHeaders();
    const updatedDetails = { ...this.editableUser };

    // Remove the password field if it's empty (to avoid sending an empty password)
    if (!updatedDetails.password) {
      delete updatedDetails.password;
    }

    this.http.put('/api/users/me', updatedDetails, { headers }).subscribe(
      (response) => {
        this.user = { ...this.editableUser }; // Update the user details
        delete this.user.password; // Ensure password is not stored in the user object
        this.closeEditModal();
      },
      (error) => {
        console.error('Error updating user details:', error);
      }
    );
  }
}