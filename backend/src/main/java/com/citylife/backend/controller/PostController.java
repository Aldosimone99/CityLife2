package com.citylife.backend.controller;

import com.citylife.backend.model.Post;
import com.citylife.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        if (post.getBody() == null || post.getBody().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Post body cannot be null or empty")); // Return JSON error
        }
        try {
            Post savedPost = postService.savePost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage())); // Return JSON error
        }
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        try {
            Long postId = Long.parseLong(id);
            return postService.getPostById(postId)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build(); // Return 400 for invalid id
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        try {
            Long postId = Long.parseLong(id);
            postService.deletePost(postId);
            return ResponseEntity.noContent().build();
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build(); // Return 400 for invalid id
        }
    }
}