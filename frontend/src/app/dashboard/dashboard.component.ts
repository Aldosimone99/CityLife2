import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  posts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  fetchPosts() {
    this.http.get<any[]>('/api/posts').pipe(
      map(posts => posts.map(post => ({
        ...post,
        userName: `${post.user.firstName} ${post.user.lastName}`
      })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())),
    ).subscribe(postsWithUsers => {
      this.posts = postsWithUsers;
    });
  }
}
