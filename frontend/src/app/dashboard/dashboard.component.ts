import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { formatDistanceToNow } from 'date-fns'; // Import date-fns for formatting

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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.http.get<any[]>('/api/posts').pipe(
      map(posts => posts.map(post => ({
        ...post,
        userName: post.user && post.user.firstName && post.user.lastName 
          ? `${post.user.firstName} ${post.user.lastName}` 
          : 'Unknown User', // Handle undefined user or missing properties
        createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) // Format as "x time ago"
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
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
          this.comments[postId].push(response);
          this.newComment[postId] = '';
        },
        (error) => console.error('Error adding comment:', error)
      );
    }
  }
}
