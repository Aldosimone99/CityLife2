import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  standalone: false,
})
export class PostsComponent implements OnInit {
  user: any = {}; // Initialize user object
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  postsPerPage: number = 5; // Default number of posts per page changed to 5
  postsPerPageOptions: number[] = [5, 10, 20, 50]; // Options for posts per page
  isDeleteConfirmationVisible: boolean = false;
  postIdToDelete: number | null = null;
  currentPage: number = 1;
  totalPages: number = 1;
  showComments: { [key: number]: boolean } = {};
  comments: { [key: number]: any[] } = {};
  newComment: { [key: number]: string } = {};
  isDeleteCommentConfirmationVisible: boolean = false;
  commentIdToDelete: number | null = null;
  postIdForCommentToDelete: number | null = null;
  newPost: string = ''; // Add a newPost variable to store the new post content

  constructor(private postService: PostService, private userService: UserService) {}

  ngOnInit() {
    this.loadAllPosts();
    this.loadUser();
  }

  loadUser(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;
    }, error => {
      console.error('Error loading user:', error); // Log for debugging
    });
  }

  loadAllPosts(): void {
    this.userService.getUsers().subscribe(users => {
      const userMap = new Map(users.map(user => [user.id, user.name]));
      this.postService.getPosts().subscribe((posts: any[]) => {
        this.posts = posts.map(post => {
          post.userName = userMap.get(post.user_id) || 'User'; // Add the user's name or 'User' if not found
          return post;
        });
        this.updateFilteredPosts(); // Update the displayed posts based on the selected number
      }, error => {
        console.error('Error loading posts:', error); // Log for debugging
      });
    }, error => {
      console.error('Error loading users:', error); // Log for debugging
    });
  }

  searchPosts() {
    const filtered = this.posts.filter(post =>
      post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      post.body.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredPosts = filtered.slice(0, this.postsPerPage); // Update the displayed posts based on the search term and selected number
  }

  viewComments(postId: number) {
  }

  confirmDeletePost(postId: number): void {
    this.postIdToDelete = postId;
    this.isDeleteConfirmationVisible = true;
  }

  cancelDeletePost(): void {
    this.postIdToDelete = null;
    this.isDeleteConfirmationVisible = false;
  }

  deletePost(): void {
    if (this.postIdToDelete !== null) {
      this.postService.deletePost(this.postIdToDelete).subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== this.postIdToDelete);
        this.filteredPosts = this.posts.slice(0, this.postsPerPage); // Update the displayed posts based on the selected number
        this.cancelDeletePost();
      }, (error: any) => {
        console.error('Error deleting post:', error); // Log for debugging
        this.cancelDeletePost();
      });
    }
  }


  updateFilteredPosts(): void {
    const startIndex = (this.currentPage - 1) * this.postsPerPage;
    const endIndex = startIndex + this.postsPerPage;
    this.filteredPosts = this.posts.slice(startIndex, endIndex);
  }

  updatePostsPerPage(): void {
    this.totalPages = Math.ceil(this.posts.length / this.postsPerPage);
    this.currentPage = 1;
    this.updateFilteredPosts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateFilteredPosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateFilteredPosts();
    }
  }

  toggleComments(postId: number): void {
    if (this.showComments[postId]) {
      this.showComments[postId] = false;
    } else {
      this.showComments[postId] = true;
      if (!this.comments[postId]) {
        this.postService.getPostComments(postId).subscribe(comments => {
          this.comments[postId] = comments;
        });
      }
    }
  }

  addComment(postId: number): void {
    const comment = {
      post_id: postId, // Ensure the post ID is included
      name: 'User', // Use a generic user name
      email: 'User@example.com', // Include a generic email
      body: this.newComment[postId]
    };
    this.postService.addComment(postId, comment).subscribe(newComment => {
      if (!this.comments[postId]) {
        this.comments[postId] = [];
      }
      this.comments[postId].push(newComment);
      this.newComment[postId] = '';
    }, error => {
      console.error('Error adding comment:', error); // Log for debugging
    });
  }

  confirmDeleteComment(postId: number, commentId: number): void {
    this.postIdForCommentToDelete = postId;
    this.commentIdToDelete = commentId;
    this.isDeleteCommentConfirmationVisible = true;
  }

  cancelDeleteComment(): void {
    this.postIdForCommentToDelete = null;
    this.commentIdToDelete = null;
    this.isDeleteCommentConfirmationVisible = false;
  }

  deleteComment(): void {
    if (this.postIdForCommentToDelete !== null && this.commentIdToDelete !== null) {
      this.postService.deleteComment(this.postIdForCommentToDelete, this.commentIdToDelete).subscribe(() => {
        if (this.postIdForCommentToDelete !== null) {
          this.comments[this.postIdForCommentToDelete] = this.comments[this.postIdForCommentToDelete].filter(comment => comment.id !== this.commentIdToDelete);
        }
        this.cancelDeleteComment();
      }, (error: any) => {
        console.error('Error deleting comment:', error); // Log for debugging
        this.cancelDeleteComment();
      });
    }
  }

  addPost(): void {
    if (this.newPost.trim()) {
      this.userService.getUsers().subscribe(users => {
        const randomUser = users[Math.floor(Math.random() * users.length)]; // Select a random user
        const userId = randomUser.id;

        const post = {
          body: this.newPost,
          title: 'Default Title', // Add a default title if required by the API
          user_id: userId // Use the random user's ID
        };

        this.postService.addPost(post).subscribe((newPost: any) => {
          this.userService.getUserById(userId).subscribe(user => {
            newPost.userName = user.name; // Add the user's name to the new post
            this.posts.unshift(newPost); // Add the new post to the beginning of the posts array
            this.newPost = ''; // Clear the input field
            this.updateFilteredPosts(); // Update the displayed posts
          }, error => {
            console.error('Error loading user:', error); // Log for debugging
          });
        }, (error: any) => {
          if (error.status === 422) {
            console.error('Validation error:', error.error); // Log validation errors
            error.error.forEach((err: any) => {
              console.error(`Field: ${err.field}, Message: ${err.message}`);
            });
          } else {
            console.error('Error creating post:', error); // Log other errors
          }
        });
      }, error => {
        console.error('Error loading users:', error); // Log for debugging
      });
    }
  }
}