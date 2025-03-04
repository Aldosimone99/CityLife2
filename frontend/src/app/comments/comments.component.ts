import { Component, OnInit, Input } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  standalone: false,
})
export class CommentsComponent implements OnInit {
  @Input() postId!: number;
  post: any;
  comments: any[] = [];
  newComment: any = { body: '' };

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe(posts => {
      this.post = posts.find((p: { id: number; }) => p.id === this.postId);
    });
    this.loadComments();
  }

  loadComments() {
    this.postService.getPostComments(this.postId).subscribe(data => {
      this.comments = data;
    });
  }

  addComment() {
    this.postService.addComment(this.postId, this.newComment).subscribe(() => {
      this.loadComments();
      this.newComment.body = '';
    });
  }
}