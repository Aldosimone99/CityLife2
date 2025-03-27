package com.citylife.backend.service;

import com.citylife.backend.model.Post;
import com.citylife.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Transactional // Ensure this method runs within a transaction
    public Post savePost(Post post) {
        if (post.getBody() == null || post.getBody().trim().length() < 1) {
            throw new IllegalArgumentException("Post body must be at least 1 character long");
        }
        if (post.getBody().length() > 10000) { // Example: Limit the body to 10,000 characters
            throw new IllegalArgumentException("Post body must not exceed 10,000 characters");
        }
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
