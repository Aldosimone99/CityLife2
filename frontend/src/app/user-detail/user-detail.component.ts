import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';

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
  newPost: string = ''; // Add a newPost variable to store the new post content
  postToDelete: any = null; // Add a variable to store the post to be deleted
  isDeleteConfirmationVisible: boolean = false; // Add a variable to control the visibility of the delete confirmation modal
  newComment: { [key: number]: string } = {}; // Add a newComment object to store new comments
  commentToDelete: any = null; // Add a variable to store the comment to be deleted
  isDeleteCommentConfirmationVisible: boolean = false; // Add a variable to control the visibility of the delete comment confirmation modal
userPosts: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
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
  }

  loadUserData(userId: number): void {
    if (!this.user) {
      this.userService.getUser(userId).subscribe(user => {
        this.user = user;
      });
    }
    if (this.posts.length === 0) {
      this.userService.getUserPosts(userId).subscribe(posts => {
        this.posts = posts;
      });
    }
  }

  toggleComments(postId: number): void {
    if (!this.comments[postId]) {
      this.userService.getPostComments(postId).subscribe((comments: any[]) => {
        this.comments[postId] = comments;
        this.showComments[postId] = true;
      });
    } else {
      this.showComments[postId] = !this.showComments[postId];
    }
  }

  addPost(): void {
    if (this.newPost.trim()) {
      const post = {
        body: this.newPost,
        title: 'Default Title' // Aggiungi un titolo di default se richiesto dall'API
      };
      this.userService.addPost(this.user.id, post).subscribe((newPost: any) => {
        this.posts.unshift(newPost); // Aggiungi il nuovo post all'inizio dell'array dei post
        this.newPost = ''; // Pulisci il campo di input
      }, error => {
        console.error('Error creating post:', error); // Log per debug
      });
    }
  }

  confirmDeletePost(post: any): void {
    this.postToDelete = post;
    this.isDeleteConfirmationVisible = true;
  }

  cancelDeletePost(): void {
    this.postToDelete = null;
    this.isDeleteConfirmationVisible = false;
  }

  deletePost(): void {
    if (this.postToDelete) {
      this.userService.deletePost(this.postToDelete.id).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== this.postToDelete.id); // Remove the deleted post from the posts array
        this.postToDelete = null;
        this.isDeleteConfirmationVisible = false;
      }, (error: any) => {
        console.error('Error deleting post:', error); // Log for debugging
      });
    }
  }

  addComment(postId: number): void {
    if (this.newComment[postId]) {
      const comment = {
        postId: postId,
        body: this.newComment[postId],
        name: 'User', // Replace with the actual user's name if available
        email: 'user@example.com' // Add an email field if required by the API
      };
      this.userService.addComment(postId, comment).subscribe((newComment) => {
        if (!this.comments[postId]) {
          this.comments[postId] = [];
        }
        this.comments[postId].push(newComment);
        this.newComment[postId] = ''; // Clear the input field
      }, error => {
        console.error('Error adding comment:', error); // Log for debugging
      });
    }
  }

  confirmDeleteComment(comment: any): void {
    this.commentToDelete = comment;
    this.isDeleteCommentConfirmationVisible = true;
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
      }, (error: any) => {
        console.error('Error deleting comment:', error); // Log for debugging
      });
    }
  }
}